const SchemaRefConfig = require('4hands-api/src/models/settings/SchemaRefConfig');

/**
 * Represents a field in a collection.
 * 
 * @module CollectionField
 * @namespace Models
 */
class CollectionField {
    /**
     * Creates a new instance of the CollectionField class.
     * @param {Object} setup - The setup object.
     * @param {any} setup.type - The type of the field.
     * @param {string} setup.fieldName - The name of the field.
     * @param {string} setup.ref - The reference of the field.
     * @param {boolean} setup.required - Indicates if the field is required.
     * @param {boolean} setup.unique - Indicates if the field is unique.
     * @param {boolean} setup.immutable - Indicates if the field is immutable.
     * @param {boolean} setup.isEncrypt - Defines if the field should be saved encrypted on the database.
     * @param {string[]} setup.enum - Array with the allowed options for the field.
     * @param {SchemaRefConfig} setup.refConfig - The configuration for related fields with other collections.
     * @param {object} setup.enumLabels - Array with the allowed options for the field.
     * @param {string|number|Object|Array|Date|Buffer|function} setup.default - If a function was provided, it will execute the function runtime, and the default will be the result of the function.
     */
    constructor(setup) {
        try {
            const {
                type,
                fieldName,
                ref,
                required,
                unique,
                immutable,
                isEncrypt,
                refConfig,
                enumLabels
            } = Object(setup);

            /**
             * The type of the field.
             * @type {any}
             */
            if (type) this.type = type;

            /**
             * The name of the field.
             * @type {string}
             */
            if (fieldName) this.fieldName = fieldName;

            /**
             * The reference of the field.
             * @type {string}
             */
            if (ref) this.ref = ref;

            /**
             * Indicates if the field is required.
             * @type {boolean}
             */
            if (required) this.required = required;

            /**
             * Indicates if the field is unique.
             * @type {boolean}
             */
            if (unique) this.unique = unique;

            /**
             * Indicates if the field is immutable.
             * @type {boolean}
             */
            if (immutable) this.immutable = immutable;

            /**
             * Indicates if the field is encrypted when saved to database.
             * @type {boolean}
             */
            this.isEncrypt = isEncrypt || false;

            /**
             * Array with the allowed options for the field.
             * @type {string[]}
             */
            if (setup.enum) this.enum = setup.enum;

            /**
             * An object with the standard labels for each enum option, the property name is the same as the enum value, and the property value is the label.
             * @type {object}
             */
            if (enumLabels) this.enumLabels = enumLabels;

            /**
             * The configuration for related fields with other collections.
             * @type {SchemaRefConfig}
             */
            if (refConfig) this.refConfig = new SchemaRefConfig(refConfig);

            /**
             * If a function was provided, it will axecute the function runtime, and the default will be the result of the function.
             * @type {string|number|Object|Array|Date|Buffer|function}
             */
            if (setup.default) this.default = setup.default;
        } catch (err) {
            throw logError;
        }
    }

    /**
     * Converts the CollectionField object to a plain JavaScript object.
     * @method
     * @returns {Object} - The plain JavaScript object representing the CollectionField.
     */
    toObject() {
        return {...this};
    }
}

module.exports = CollectionField;
