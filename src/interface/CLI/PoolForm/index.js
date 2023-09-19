const EventsHandlers = require('./EventsHandlers');
const QuestionModel = require('./QuestionModel');
const Prompt = require('../../../services/Prompt');
const ToolsCLI = require('../ToolsCLI');
const FormCtrlCLI = require('../FormCtrlCLI');
const StringTemplateBuilder = require('../../StringTemplateBuilder');
const tools = new ToolsCLI();

/**
 * Represents a form controller for a pool of questions.
 * @class
 */
class PoolForm extends FormCtrlCLI {
    static EventsHandlers = EventsHandlers;
    static QuestionModel = QuestionModel;
    static getQuestion = (questionID, options) => {
        const poolQuestions = require('./poolQustions');
        const { next } = new Object(options || {});
        const question = poolQuestions[questionID];

        if (question) {
            question.next = next || question.next;
            return question
        }
    }

    /**
     * @constructor
     * @param {Object} setup - The setup configuration for the form.
     * @param {string} [setup.startQuestion=''] - The ID of the first question.
     * @param {Array<QuestionModel>} [setup.questions=[]] - The list of questions to be used in the form.
     * @param {EventsHandlers} [setup.events={}] - The event handlers for the form.
     * @param {Object} [setup.values={}] - The default values for the form fields.
     * @param {Boolean} [setup.autoSaveAnswers=false] - The default values for the form fields.
     * @param {Object} view - The view object for the form.
     */
    constructor(setup, view) {
        super(setup, view);
        const { startQuestion, questions, events, values, autoSaveAnswers } = setup || {};

        this.current = null;
        this.prompt = new Prompt();
        this.startQuestion = startQuestion;
        this.events = new EventsHandlers(events);
        this.questions = Array.isArray(questions) && !isObjectID(questions) ? questions.map(question => new QuestionModel(question, this)) : [];
        this.values = values || {};
        this.autoSaveAnswers = autoSaveAnswers;
        this.view = () => view;
    }

    get parent() {
        return this.view && this.view() || {};
    }

    /**
     * Returns the question object with the specified ID.
     * @param {string} id - The ID of the question.
     * @returns {?QuestionModel}
     */
    getQuestion(id) {
        return Array.isArray(this.questions) && this.questions.find(item => item.id === id);
    }

    /**
     * Returns the first question object on the this.questions array list.
     * @returns {?QuestionModel}
     */
    getFirstQuestion() {
        return Array.isArray(this.questions) && (this.questions.length) && this.questions[0];
    }

    /**
     * Adds a new question to the list of questions.
     * @param {QuestionModel} [setup] - The setup configuration for the question.
     */
    setQuestion(setup) {
        if (setup && Array.isArray(this.questions)) {
            this.questions.push(new QuestionModel(setup, this));
        }
    }

    /**
     * Starts the form and triggers the "start" event.
     * @returns {Object} - The form data which is the result of the form filled.
     * @throws {Error} - If an error occurs during form execution.
     */
    async startPool() {
        try {
            await this.events.triggerEvent('start', this);
    
            for (let i = 0; i < this.formFields.length; i++) {
                const currKey = this.formFields[i];
                const fieldSchema = this.getFieldSchema(currKey);
                const currentDoc = this.parent.getValue && this.parent.getValue('currentDoc');
                let answer = '';
    
                if (currentDoc) {
                    answer = await this.prompt.question(new StringTemplateBuilder()
                        .newLine()
                        .text(`Field -> ${currKey} : ${fieldSchema.type.name}`).newLine()
                        .text(`Current value:`).newLine()
                        .text('- ' + (currentDoc[currKey] || 'EMPTY')).newLine()
                        .newLine()
                        .text(`Enter the new value: `)
                    .end());
                } else {
                    if (this.defaultData && this.mode === 'create' && this.defaultData[currKey]) {
                        answer = this.defaultData[currKey];
                    } else {
                        answer = await this.prompt.question(currKey + ': ');
                    }
                }
    
                if (answer) {
                    switch(fieldSchema.type.name) {
                        case 'Object': {
                            this.setField(currKey, JSON.parse(answer));
                            break;
                        }
                        default: {
                            this.setField(currKey, answer);
                            break
                        }
                    }
    
                    await this.events.triggerEvent('answer', this, answer);
                }
            }
    
            await this.end(this);
            return this.formData;
        } catch(err) {
            throw new Error.Log(err);
        }
    }

    /**
     * Retrieves the value at the given key path from the values object.
     * @param {string} keyPath - The dot-separated path to the desired value.
     * @returns {*} The value at the given key path.
     */
    getValue(keyPath) {
        const parsedPath = keyPath.split('.');
        let currentValue = this.values;

        parsedPath.map(path => {
            if (currentValue) {
                currentValue = currentValue[path];
            }
        });

        return currentValue;
    }

    /**
     * Sets the value at the given key path in the values object.
     * @param {string} keyPath - The dot-separated path to the desired value.
     * @param {*} value - The new value to set at the given key path.
     * @param {boolean} [override=false] - Whether to override the existing value(s) at the given key path with the new value.
     */
    setValue(keyPath, value, override) {
        const currentValue = this.getValue(keyPath);

        if (typeof value === 'object' && !Array.isArray(value) ) {
            this.values[keyPath] = override ? {...currentValue, ...value} : value;
        } else {
            this.values[keyPath] = value;
        }

        return this.values[keyPath];
    }

    /**
     * Triggers the start event and goes to the startQuestion question.
     * @throws When the start event or the error event thrown by goTo is rejected.
     */
    async start() {
        const firstQuestion = this.questions.length && this.getFirstQuestion();

        if (!firstQuestion) {
            return new Error.Log({
                name: 'QUESTION-REQUIRED',
                message: `Any question was provided! It's required to have at least one question to run the method PoolForm.start().`
            })
        }

        try {
            await this.events.triggerEvent('start', this);
            await this.goTo(this.startQuestion || firstQuestion.id);

            return this;
        } catch(err) {
            await this.events.triggerEvent('error', this, err);
        }
    }

    /**
     * Triggers the next event and goes to the current.next question.
     * @returns {*} The result of calling goTo with the current.next question ID.
     * @throws When the next event or the error event thrown by goTo is rejected.
     */
    async next() {
        try {
            await this.events.triggerEvent('next', this);
            return await this.goTo(this.current.next);
        } catch(err) {
            await this.events.triggerEvent('error', this, err);
        }
    }

    /**
     * Triggers the back event and goes to the current.back question.
     * @returns {*} The result of calling goTo with the current.back question ID.
     * @throws When the back event or the error event thrown by goTo is rejected.
     */
    async back() {
        try {
            await this.events.triggerEvent('back', this);
            return await this.goTo(this.current.back);
        } catch(err) {
            await this.events.triggerEvent('error', this, err);
        }
    }

    /**
     * Goes to the question with the given ID and triggers its trigger method.
     * @param {*} questionID - The ID of the question to go to.
     * @throws When the trigger method of the question is rejected or the given question ID is not valid.
     */
    async goTo(questionID) {
        const question = this.getQuestion(questionID);

        if (question) {
            this.current = question;

            return await question.trigger();
        } else {
            tools.print('You need to provide at least one question to the PoolForm instance! The questionID receive is not valid! ['+questionID+']');
        }
    }

    /**
     * Goes to the view with the given path and optional parameters.
     * @param {string} viewPath - The path to the view to go to.
     * @param {*} [params] - Optional parameters to pass to the view.
     */
    async goToView(viewPath, params) {
        await this.view().goToView(viewPath, params)
    }

    /**
     * Calls the `repeat` event and goes back to the current question.
     * @async
     * @function repeat
     * @returns {Promise} A promise that resolves with the result of calling `goTo(this.current.id)`.
     * @throws Throws an error if an error occurs when calling the `repeat` event.
     */
    async repeat() {
        try {
            await this.events.triggerEvent('repeat', this);
            return await this.goTo(this.current.id);
        } catch(err) {
            await this.events.error(this, err);
        }
    }

    /**
     * Sets a new listener for the provided address
     * @async
     * @function setListener
     * @param {string} eventName - Name of the event.
     * @example -> `setListener('onTrigger', () => takeAnAction())`
     * @returns {void} - Return nothing.
     */
    setListener(eventName, action) {
        if (eventName && action) {
            this.events[eventName] = action;

            this.questions.map(q => q.setListener(eventName, action));
        }
    }

    /**
     * Override a listerner on the PoolForm.
     * @async
     * @function overrideListener
     * @returns {Promise} - 
     * @throws Throws an error if an error occurs.
     */
    overrideListener(eventName, action) {
        if (eventName && action) {
            this.events[eventName] = action;
        }
    }

    /**
     * Calls the `end` event and goes back to the current question.
     * @async
     * @function end
     * @returns {Promise} - 
     * @throws Throws an error if an error occurs when calling the `end` event.
     */
    async end() {
        return await this.events.triggerEvent('end', this);
    }
}

/**
 * A class representing a form that contains a pool of questions.
 * @module PoolForm
 */
module.exports = PoolForm;
