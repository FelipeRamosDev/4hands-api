const dbHelpers = require('4hands-api/src/helpers/database/dbHelpers');
const relationalHelper = require('4hands-api/src/helpers/database/relationalFields');
const config = require('4hands-api/configs/project');

/**
 * Middleware function executed before saving a document.
 * Increments the counter for the current collection and sets index and cod fields.
 * @function
 * @async
 * @param {function} next - The function to be called to proceed to the next middleware in the stack.
 * @throws {Error} - Throws an error if there is an issue incrementing the counter or setting fields.
 */
async function preSave(next) {
    try {
        const collection = this.collection.collectionName;

        if (collection !== config.database.counterCollection) {
            const counter = await dbHelpers.increaseCounter(collection);

            // Incrementing the index field
            if (counter) {
                const count = counter.value;
                const symbol = counter.symbol;

                this.index = count;
                this.cod = symbol + count;
            } else {
                throw logError('database.counter_not_found', collection);
            }

            await dbHelpers.createEncryptFields(this);
            next();
        }
    } catch(err) {
        throw logError(err);
    }
}

/**
 * Middleware function executed before updating a single document.
 * Updates the modifiedAt timestamp and handles relational updates.
 * @function
 * @async
 * @param {function} next - The function to be called to proceed to the next middleware in the stack.
 * @throws {Error} - Throws an error if there is an issue updating the document or handling relationships.
 */
async function preUpdateOne(next) {
    try {
        const collection = this._collection.collectionName;

        if (!this._update) {
            return next();
        }

        // Updating the modifiedAt timestamp
        this._update.modifiedAt = Date.now();
        this.sessionUser = this._update.sessionUser;
        delete this._update.sessionUser;

        if (!this._update.onlyAct && collection !== config.database.counterCollection) {
            relationalHelper.onUpdate.call(this);
        }

        dbHelpers.updateEncryptFields(this);
        next();
    } catch(err) {
        throw logError(err);
    }
}

/**
 * Middleware function executed after updating a single document.
 * Emits events based on the updated document's status and filter.
 * @function
 * @async
 * @throws {Error} - Throws an error if there is an issue emitting events.
 */
async function postUpdateOne() {
    try {
        const collection = this.model.modelName;
        const $set = Object(this).getSafe('_update.$set');

        if (!$set) {
            return;
        }

        if ($set.status) {
            process.emit(`status:transition:${collection}:${$set.status}`, this);
        }

        delete $set.status;
        process.emit(`update:${collection}`, this);
        process.emit(`socket:update:${collection}:${JSON.stringify(this.getFilter())}`, this);
    } catch (err) {
        throw logError(err);
    }
}

/**
 * Middleware function executed after saving a document.
 * Handles relational updates and emits a create event for the collection.
 * @function
 * @async
 * @throws {Error} - Throws an error if there is an issue handling relationships or emitting events.
 */
async function postSave() {
    try {
        const collection = this.collection.collectionName;

        if (collection !== config.database.counterCollection) {
            await relationalHelper.onCreate.call(this);
            process.emit(`create:${collection}`, this);
        }

        return;
    } catch(err) {
        throw logError(err);
    }
}

/**
 * Middleware function executed before deleting a document.
 * Handles relational updates.
 * @function
 * @async
 * @param {function} next - The function to be called to proceed to the next middleware in the stack.
 * @throws {Error} - Throws an error if there is an issue handling relationships.
 */
async function preDelete(next) {
    try {
        const collection = this._collection.collectionName;

        if (collection !== config.database.counterCollection) {
            await relationalHelper.onDelete.call(this);
        }

        next();
    } catch(err) {
        throw logError('database.events.pre_delete');
    }
}

/**
 * Middleware function executed after deleting a document.
 * Does not perform any specific action.
 * @function
 * @async
 * @throws {Error} - Throws an error if there is an issue handling the post-delete process.
 */
async function postDelete() {
    try {
        return;
    } catch(err) {
        throw logError('database.events.post_delete');
    }
}

module.exports = {
    preSave,
    preUpdate: preUpdateOne,
    postUpdate: postUpdateOne,
    postSave,
    preDelete,
    postDelete
};
