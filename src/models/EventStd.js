const CRUD = require('4hands-api/src/services/database/crud');

/**
 * Model to set the events that will trigger actions throughout the app.
 * @module EventStd
 * @namespace Models
 */
class EventStd {
    /**
     * Creates a new instance of the EventStd class.
     * @param {Object} setup - The setup object.
     * @param {string} setup.name - String with the event's name.
     * @param {function} setup.handler - Function with the handler to be executed when the event is triggered.
     * @param {Object} setup.target - The object that is wrapping the event (e.g., Workflow, Collection, etc.).
     * @throws {Error} - Throws an error if the setup object is not valid.
     */
    constructor(setup) {
        try {
            const { name, handler, target } = Object(setup);

            /**
             * String with the event's name.
             * @property {string}
             */
            this.name = name;

            /**
             * Function with the handler to be executed when the event is triggered.
             * @property {function}
             */
            this.handler = handler || Function();

            /**
             * The object that is wrapping the event. For example: Workflow, Collection, etc.
             * @property {Object}
             */
            this.target = target;

            this.add(target);
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    /**
     * Triggers the event, emitting it to the specified target.
     * @param {Object} target - The target object on which the event is triggered.
     * @returns {*} - Returns the result of the event emission.
     * @throws {Error} - Throws an error if event triggering fails.
     */
    trigger(target) {
        const Status = require('4hands-api/src/models/settings/Status');

        try {
            if (target instanceof Status) {
                this.name += ':' + this.target.statusID;
            }

            return process.emit(this.name, target);
        } catch (err) {
            throw new Error.Log(err);
        }
    }
    
    /**
     * Adds an event listener to the specified context and handles event triggering.
     * @param {Object} context - The context object to which the event listener is added.
     * @returns {Object} - The event listener added to the process.
     * @throws {Error} - Throws an error if event listener addition fails.
     */
    add(context) {
        const Status = require('4hands-api/src/models/settings/Status');
        const self = this;

        try {
            if (this.target instanceof Status) {
                this.name += ':' + this.target.statusID;
            }

            /**
             * Event listener function handling the triggered event.
             * @param {*} args - Arguments passed with the event.
             */
            this.listener = process.on(this.name, async function (...args) {
                try {
                    const populatedTarget = await self.populateTarget.call(context, ...args);

                    // Replacing the target argument by its populated document. args[0] = target
                    if (args.length) {
                        args[0].populated = populatedTarget;
                    }

                    if (context instanceof Status && context.workflow.preventStatus.call(context, ...args)) {
                        return;
                    }

                    self.handler.call(context, ...args);
                } catch (err) {
                    throw new Error.Log(err);
                }
            });

            return this.listener;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    /**
     * Populates the target object with data from the database.
     * @param {Object} target - The target object to be populated.
     * @returns {Object} - The populated target object.
     * @throws {Error} - Throws an error if target population fails.
     */
    async populateTarget(target) {
        let collectionName = Object(target).getSafe('_collection.collectionName');
    
        try {
            if (!collectionName && !target) {
                return;
            }

            if (target._id && target._id.oid()) {
                const docQuery = await CRUD.getDoc({ collectionName: target.collection.collectionName, filter: { _id: target.id } }).defaultPopulate();
                return docQuery.initialize();
            }
            
            const docQuery = await CRUD.getDoc({ collectionName, filter: target.getFilter() }).defaultPopulate();
            const doc = docQuery.initialize();
            
            return doc;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = EventStd;
