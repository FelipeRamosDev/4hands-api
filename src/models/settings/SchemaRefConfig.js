/**
 * Represents the reference configuration for a schema field.
 * 
 * @module SchemaRefConfig
 */
class SchemaRefConfig {
    /**
     * Creates a new instance of the SchemaRefConfig class.
     * @param {Object} [setup] - The setup object.
     * @param {string} [setup.type] - The type of the reference.
     * @param {string} [setup.relatedField] - The related field of the reference.
     * @param {boolean} [setup.toDelete=false] - Indicates if the reference should be deleted.
     */
    constructor(setup) {
        const { relatedField, type, toDelete } = Object(setup);

        /**
         * The value type of the reference.
         * Allowed: "array-oid" or "ObjectId"
         * @type {string}
         */
        this.type = type;

        /**
         * The related field of the reference.
         * @type {string}
         */
        this.relatedField = relatedField;

        /**
         * Indicates if the reference should be deleted.
         * @type {boolean}
         */
        this.toDelete = Boolean(toDelete);
    }
}

module.exports = SchemaRefConfig;
