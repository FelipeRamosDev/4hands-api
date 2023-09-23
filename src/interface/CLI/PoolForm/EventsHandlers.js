const ToolsCLI = require('@CLI/ToolsCLI');
const QuestionModel = require('./QuestionModel');

/**
 * Represents a handler for events related to a form.
 * @class
 */
class EventsHandlers {
    /**
     * Creates an instance of EventsHandlers.
     * @constructor
     * @param {Object} [setup] - The configuration for the instance.
     * @param {Function} [setup.onStart=async () => {}] - The function to be called when the form starts.
     * @param {Function} [setup.onTrigger=async () => {}] - The function to be called when an event is triggered.
     * @param {Function} [setup.onNext=async () => {}] - The function to be called when the user goes to the next question.
     * @param {Function} [setup.onBack=async () => {}] - The function to be called when the user goes back to the previous question.
     * @param {Function} [setup.onChange=async () => {}] - The function to be called when the user changes an answer.
     * @param {Function} [setup.onRepeat=async () => {}] - The function to be called when the user wants to repeat a question.
     * @param {Function} [setup.onAnswer=async () => {}] - The function to be called when the user provides an answer.
     * @param {Function} [setup.onError=async () => {}] - The function to be called when an error occurs.
     * @param {Function} [setup.onEnd=async () => {}] - The function to be called when the form ends.
     */
    constructor(setup = {
        onStart: async () => {},
        onTrigger: async () => {},
        onNext: async () => {},
        onBack: async () => {},
        onChange: async () => {},
        onRepeat: async () => {},
        onAnswer: async () => {},
        onError: async () => {},
        onEnd: async () => {}
    }, parent) {
        const {onStart, onTrigger, onNext, onBack, onChange, onRepeat, onAnswer, onError, onEnd} = setup || {};

        // this._parent = () => parent;
        this.onStart = onStart;
        this.onTrigger = onTrigger;
        this.onNext = onNext;
        this.onBack = onBack;
        this.onChange = onChange;
        this.onRepeat = onRepeat;
        this.onAnswer = onAnswer;
        this.onError = onError;
        this.onEnd = onEnd;
        this.tools = new ToolsCLI();
    }

    // get parent() {
    //     return this._parent && this._parent()
    // }

    /**
     * Triggers a specified event with optional parameters.
     *
     * @async
     * @function
     * @param {QuestionModel} eventName - The Question event that triggered the event
     * @param {...*} args - The event name and any optional parameters.
     * @throws {Error.Log} - If an error occurs while handling the event.
     */
    async triggerEvent(eventName, ...args) {
        if (this[eventName]){
            return await this[eventName](...args);
        }

        return
    }

    /**
     * Starts the event and returns the event object.
     *
     * @async
     * @function
     * @param {*} ev - The event object.
     * @returns {*} - The event object.
     * @throws {Error.Log} - If an error occurs while handling the event.
     */
    async start (ev) {
        try {
            await this.triggerEvent('onStart', ev, this.tools);
            return ev;
        } catch (err) {
            this.triggerEvent('error', this, err);
        }
    }

    /**
     * Triggers the event and returns the event object.
     *
     * @async
     * @function
     * @param {*} ev - The event object.
     * @returns {*} - The event object.
     * @throws {Error.Log} - If an error occurs while handling the event.
     */
    async trigger (ev) {
        try {
            await this.triggerEvent('onTrigger', ev, this.tools);
            return ev;
        } catch (err) {
            this.triggerEvent('error', this, err);
        }
    }

    /**
     * Triggers the "next" event and returns the event object.
     *
     * @async
     * @function
     * @param {*} ev - The event object.
     * @returns {*} - The event object.
     * @throws {Error.Log} - If an error occurs while handling the event.
     */
    async next (ev) {
        try {
            await this.triggerEvent('onNext', ev, this.tools);
            return ev;
        } catch (err) {
            this.triggerEvent('error', this, err);
        }
    }

    /**
     * Triggers the "back" event and logs a message to the console.
     *
     * @async
     * @function
     * @param {*} ev - The event object.
     * @returns {*} - The event object.
     * @throws {Error.Log} - If an error occurs while handling the event.
     */
    async back (ev) {
        try {
            await this.triggerEvent('onBack', ev, this.tools);
            console.log('>> onBack');
            return ev;
        } catch (err) {
            this.triggerEvent('error', this, err);
        }
    }

    /**
     * Triggers the "repeat" event and logs a message to the console.
     *
     * @async
     * @function
     * @param {*} ev - The event object.
     * @returns {*} - The event object.
     * @throws {Error.Log} - If an error occurs while handling the event.
     */
    async repeat (ev) {
        try {
            await this.triggerEvent('onRepeat', ev, this.tools);
            console.log('>> onRepeat');
            return ev;
        } catch (err) {
            this.triggerEvent('error', this, err);
        }
    }

    /**
     * Handles the "answer" event and returns the event object.
     *
     * @async
     * @function
     * @param {*} ev - The event object.
     * @returns {*} - The event object.
     * @throws {Error.Log} - If an error occurs while handling the event.
     */
    async answer (ev) {
        try {
            if (!ev.answer && ev.required) {
                const error = new Error.Log({
                    name: 'AnswerRequired',
                    message: `The answer for this question is required!`
                });
    
                error.consolePrint();
                return ev.trigger();
            }

            if (ev.parentPool && ev.parentPool.autoSaveAnswers) {
                ev.setValue(ev.id, ev.answer);
            }
    
            await this.triggerEvent('onAnswer', ev, this.tools, ev.answer);
        } catch (err) {
            this.triggerEvent('error', this, err);
        }
    }

    /**
     * Handles error event.
     * 
     * @async
     * @param {any} ev - The event object.
     * @param {Error} err - The error object.
     * @throws {Error} Throws an error if an error occurred while executing the event handler.
     * @returns {Promise<any>} Promise that resolves to the event object if the event was handled successfully.
     */
    async error (ev, err) {
        try {
            await this.triggerEvent('onError', ev, this.tools, new Error.Log(err));
            return ev;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
    /**
     * Handles end event.
     * 
     * @async
     * @param {any} ev - The event object.
     * @throws {Error} Throws an error if an error occurred while executing the event handler.
     * @returns {Promise<any>} Promise that resolves to the event object if the event was handled successfully.
     */
    async end (ev) {
        try {
            if (ev.parentPool && ev.parentPool.goNext) {
                return await ev.parentPool.goNext();
            }

            await this.triggerEvent('onEnd', ev, this.tools);
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

/**
 * Represents a handler for events related to a form.
 * @module EventsHandlers
 */
module.exports = EventsHandlers;
