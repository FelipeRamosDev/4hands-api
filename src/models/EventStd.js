const CRUD = require('@CRUD');

/**
 * Model to set the events to that will trigger the actions through the app.
 * @module EventStd
 */
class EventStd {
    /**
     * Creates a new instance of the EventStd class.
     * @param {Object} setup - The setup object.
     * @param {string} setup.name - String with the event's name.
     * @param {function} setup.handler - Function with the handler to be executed when the event is triggered
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
             * Function with the handler to be executed when the event is triggered
             * @property {function}
             */
            this.handler = handler || Function();

            /**
             * The object that is wrapping the event. For example: Workflow, Collection, etc.
             * @property {Object}
             */
            this.target = target;

            this.add(target)
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    trigger(target) {
        const Status = require('@models/settings/Status');

        try {
            if (target instanceof Status) {
                this.name += ':' + this.target.statusID;
            }

            return process.emit(this.name, target);
        } catch (err) {
            throw new Error.Log(err);
        }
    }
    
    add(context) {
        const Status = require('@models/settings/Status');
        const self = this;

        try {
            if (this.target instanceof Status) {
                this.name += ':' + this.target.statusID;
            }

            this.listener = process.on(this.name, async function (...args) {
                try {
                    const populatedTarget = await self.populateTarget.call(context, ...args);

                    // Replacing the targer argument by its populated document. args[0] = target
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

    async populateTarget(target) {
        let collectionName = Object(target).getSafe('_collection.collectionName');
    
        try {
            if (!collectionName && !target) {
                return;
            }

            if (target._id && target._id.oid()) {
                const docQuery = await CRUD.getDoc({collectionName: target.collection.collectionName, filter: { _id: target.id }}).defaultPopulate();
                return docQuery.initialize();
            }
            
            const docQuery = await CRUD.getDoc({collectionName, filter: target.getFilter() }).defaultPopulate();
            const doc = docQuery.initialize();
            
            return doc;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = EventStd;
