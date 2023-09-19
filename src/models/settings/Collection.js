const CollectionField = require('./CollectionField');
const SchemaDB = require('@models/SchemaDB');

/**
 * Represents a collection on the database.
 * @class Collection
 * @extends SchemaDB
 */
class Collection extends SchemaDB {
    static Types = SchemaDB.mongoSchema.Types;
    
    /**
     * Creates a new instance of the Collection class.
     * @param {Object} setup - The setup object.
     * @param {string} setup.name - The name of the collection.
     * @param {string} setup.symbol - The symbol of the collection.
     * @param {string} setup.displayName - The display name of the collection.
     * @param {string} setup.pluralLabel - The plural label of the collection.
     * @param {string} setup.singularLabel - The singular label of the collection.
     * @param {CollectionField[]} setup.fieldsSet - The fields of the collection.
     */
    constructor(setup) {
        super(setup);

        try {
            const { name, symbol, displayName, pluralLabel, singularLabel, excludeGlobals, fieldsSet } = Object(setup);

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
             * Globals to be excluded from the collection
             * @property {string[]}
             */
            this.excludeGlobals = excludeGlobals;

            /**
             * The fields of the collection.
             * @property {CollectionField[]}
             */
            this.fieldsSet = Array.isArray(fieldsSet) && fieldsSet.map(field => new CollectionField(field).toObject()) || [];
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    static Types = SchemaDB.mongoSchema.Types;

    getFieldSet(fieldName) {
        try {
            return this.fieldsSet.find(item => item.fieldName === fieldName);
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Collection;
