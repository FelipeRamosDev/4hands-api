const CollectionField = require('./CollectionField');
const SchemaDB = require('@models/SchemaDB');

/**
 * Represents a collection in the database.
 * @class Collection
 * @extends SchemaDB
 */
class Collection extends SchemaDB {
    /**
     * Represents MongoDB schema types.
     * @static
     * @type {mongoose.Schema.Types}
     */
    static Types = SchemaDB.mongoSchema.Types;
    
    /**
     * Creates a new instance of the Collection class.
     * @param {Object} setup - The setup object containing collection details and configurations.
     * @param {string} setup.name - The name of the collection.
     * @param {string} setup.symbol - The symbol of the collection.
     * @param {string} setup.displayName - The display name of the collection.
     * @param {string} setup.pluralLabel - The plural label of the collection.
     * @param {string} setup.singularLabel - The singular label of the collection.
     * @param {string[]} setup.excludeGlobals - Globals to be excluded from the collection.
     * @param {CollectionField[]} setup.fieldsSet - The fields of the collection.
     * @param {object} setup.Model - The collection's model.
     * @throws {Error} If collection setup fails.
     */
    constructor(setup) {
        super(setup);

        try {
            const { name, symbol, displayName, pluralLabel, singularLabel, excludeGlobals, fieldsSet, Model } = Object(setup);

            /**
             * The symbol of the collection.
             * @property {string}
             */
            this.symbol = symbol;

            /**
             * The name of the collection.
             * @property {string}
             */
            this.name = name;

            /**
             * The display name of the collection.
             * @property {string}
             */
            this.displayName = displayName;

            /**
             * The plural label of the collection.
             * @property {string}
             */
            this.pluralLabel = pluralLabel;

            /**
             * The singular label of the collection.
             * @property {string}
             */
            this.singularLabel = singularLabel;

            /**
             * Globals to be excluded from the collection.
             * @property {string[]}
             */
            this.excludeGlobals = excludeGlobals;

            /**
             * The collection's model.
             * @property {object}
             */
            this.Model = Model;

            /**
             * The fields of the collection.
             * @property {CollectionField[]}
             */
            this.fieldsSet = Array.isArray(fieldsSet) && fieldsSet.map(field => new CollectionField(field).toObject()) || [];
        } catch (err) {
            /**
             * Thrown if collection setup fails.
             * @throws {Error.Log}
             */
            throw new Error.Log(err);
        }
    }

    /**
     * Gets a specific field from the collection's field set.
     * @param {string} fieldName - The name of the field to retrieve.
     * @returns {CollectionField} - The CollectionField object representing the specified field.
     * @throws {Error.Log} - Throws an error if field retrieval fails.
     */
    getFieldSet(fieldName) {
        try {
            return this.fieldsSet.find(item => item.fieldName === fieldName);
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    /**
     * Adds a new field to the collection.
     * @param {CollectionField} config - The configuration object for the new field.
     */
    addNewField(config) {
        this.fieldsSet.push(new CollectionField(config).toObject());
    }
}

module.exports = Collection;
