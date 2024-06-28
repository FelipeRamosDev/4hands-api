const CollectionField = require('4hands-api/src/services/CollectionBucket/CollectionField');

/**
 * Represents a collection field that references encrypted data stored in the 'safe_values' collection.
 * Extends CollectionField class and sets up the type as ObjectId, referencing 'safe_values' collection.
 *
 * @class
 * @extends CollectionField
 * @param {Object} setup - The setup object containing configuration details for the collection field.
 * @throws {Error.Log} If there is an error during instantiation, it is caught and logged.
 */
class CollectionEncrypt extends CollectionField {
    /**
     * Creates a new CollectionEncrypt instance with the provided setup parameters.
     *
     * @constructor
     * @param {Object} setup - The setup object containing configuration details for the collection field.
     * @throws {Error.Log} If there is an error during instantiation, it is caught and logged.
     */
    constructor(setup) {
        super(setup);

        try {
            const Collection = require('4hands-api/src/models/settings/Collection');
            const { ObjectId } = Collection.Types;

            this.type = ObjectId;
            this.ref = 'safe_values';
        } catch (err) {
            throw logError;
        }
    }
}

module.exports = CollectionEncrypt;
