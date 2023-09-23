const Prompt = require('@src/services/Prompt');
const PoolForm = require('./index');

/**
 * Class representing a question model.
 * @class
 */
class QuestionModel {
    /**
     * Create a question model.
     * @constructor
     * @param {Object} setup - The setup object.
     * @param {string} setup.id - The question ID.
     * @param {string} setup.type - The question type (default, form-control).
     * @param {string} setup.text - The question text.
     * @param {boolean} setup.required - Whether the question is required.
     * @param {string} setup.next - The ID of the next question.
     * @param {EventsHandlers} setup.events - The events handlers object.
     * @param {PoolForm} setup.formCtrl - The pool form object.
     * @param {Object} ctrl - The control object.
     */
    constructor(setup, ctrl) {
        const PoolFormModel = require('./index');
        const EventsHandlers = require('./EventsHandlers');
        const {id, type, text, required, events, next, formCtrl} = new Object(setup || {});

        this.id = id;
        this.type = type || 'default';
        this.text = text;
        this.required = required;
        this.next = next;
        this.ctrl = () => ctrl;

        if (formCtrl) {
            this.type = 'form-control';
            this.formCtrl = new PoolFormModel(formCtrl, this);
        }

        this.prompt = new Prompt();
        this.events = new EventsHandlers({
            ...(ctrl && ctrl.questions && ctrl.questions.events),
            ...events
        });
    }

    /**
     * The tools object.
     * @type {ToolsCLI}
     */
    get tools() {
        return toolsCLI || {};
    }

    /**
     * The command-line interface control object.
     * @type {ViewCLI}
     */
    get parentPool() {
        return this.ctrl() || {};
    }

    get poolData() {
        return this.getSafe('parentPool.values');
    }

    async redirectTo(path, timeout) {
        try {
            return await new Promise((resolve, reject) => {
                this.tools.print(`Redirecting to the "${path}" view...`, 'REDIRECTING');

                setTimeout(async () => {
                    try {
                        const redirect = await this.parentPool.goToView(path || 'home');
                        resolve(redirect);
                    } catch (err) {
                        reject(err);
                    }
                }, timeout || 2000);
            });
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    /**
     * Sets the value of a key.
     * @param {string} key - The key to set the value for.
     * @param {*} value - The value to set.
     */
    setValue(key, value) {
        return this.parentPool.setValue(key, value);
    }

    /**
     * Gets the value of a key.
     * @param {string} key - The key to get the value for.
     * @returns {*} The value of the key.
     */
    getValue(key) {
        return this.parentPool.getValue(key);
    }

    /**
     * Gets a question by ID.
     * @param {string} id - The ID of the question to get.
     * @returns {QuestionModel} The question model object.
     */
    getQuestion(id) {
        return this.parentPool.getQuestion(id);
    }

    /**
     * 
     * @param {PoolForm} setup - New PoolForm setup.
     * @returns {PoolForm}
     */
    createPool(setup) {
        const newPool = new PoolForm(setup);
        return newPool;
    }

    /**
     * Goes to the next question.
     * @returns {*} The next question.
     */
    async goNext(stepName) {
        const nextQ = this.parentPool.getQuestion(stepName || this.next);
        
        if (nextQ) {
            return await nextQ.trigger();
        } else {
            return await this.endParentPool();
        }
    }

    async endParentPool() {
        return await this.parentPool.end();
    }

    /**
     * Triggers the question.
     * @returns {*} The result of the question trigger.
     */
    async trigger() {
        try {
            await this.events.trigger(this);

            if (this.text) {
                const answer = await this.prompt.question(this.text);
                
                this.answer = answer;
                const answerRes = await this.events.triggerEvent('answer', this, answer);
                if (answerRes instanceof Error.Log) {
                    answerRes.consolePrint();
                    return answerRes;
                }
            }

            if (this.formCtrl) {
                return await this.formCtrl.startPool();
            }

            return await this.goNext();
        } catch(err) {
            this.events.triggerEvent('error', this, err);
        }
    }

    /**
     * Sets a listener for the specified event.
     * @param {string} eventName - The name of the event to set the listener for.
     * @param {function} action - The action to perform when the event is triggered.
     */
    setListener(eventName, action) {
        if (!this.events[eventName]) {
            this.events[eventName] = action;
        }
    }

    /**
     * Overrides the listener for the specified event.
     * @param {string} eventName - The name of the event to override the listener for.
     * @param {function} action - The new action to perform when the event is triggered.
     */
    overrideListener(eventName, action) {
        this.events[eventName] = action;
    }
}

/**
 * A class for Question used on PoolForm of CLI Interface
 * @module QuestionModel
 */
module.exports = QuestionModel;
