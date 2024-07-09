/**
 * Utility class for validating and handling MongoDB schemas in the application.
 */
class ValidateSchema {
    /**
     * Constructs a ValidateSchema instance based on the provided rules.
     * @param {string|Object} rules - A string indicating the collection name to use as schema,
     * or an object specifying the Mongoose schema configurations.
     * @throws {Error} - Throws an error if the provided rules are invalid or the collection name is not found.
     */
    constructor(rules) {
        const API = global._4handsAPI?.API;
        const {Schema} = require('mongoose');
        const schemas = API.database.collections.toArray();

        // Initializing the schema
        if (Boolean.isValid(rules).stringFilled()) {
            const collection = schemas.find(item => item.name === rules.valueOf());
            // If the rules provided is a string with the collection name, and this collection name is a valid name. It will use it as schema.
            if (collection) {
                this.ModelDB = collection.DB
                this._schema = collection.schema;
            } else {
                throw logError('common.request_model_schema_not_found', rules);
            }
        }
        
        if (Boolean.isValid(rules).objectFilled() && !(rules instanceof String)) {
            // If the rules provided is an object with the mongoose schema configurations, then it will create a internal schema for the request.
            try {
                Object.keys(rules).map(key => {
                    const current = rules[key];
                    const collection = Boolean.isValid(current).path('collection').stringFilled();
                    const loadedSchema = collection && Boolean.isValid(schemas).path(collection + '.schema').objectFilled();

                    if (loadedSchema) {
                        rules[key].type = loadedSchema;
                    }
                });

                this._schema = new Schema(rules, {autoCreate: false, autoIndex: false});
            } catch(err) {
                throw logError(err);
            }
        }
    }

    /**
     * Validates the provided data against the schema and returns the validation result.
     * @param {Object} data - The data to be validated against the schema.
     * @param {boolean} [returnValidObj=false] - A flag indicating whether to return the validated object.
     * @returns {ValidationError|Object} - If `returnValidObj` is true, returns the validated object.
     * Otherwise, returns the validation error object.
     */
    validate(data, returnValidObj) {
        const { model } = require('mongoose');
        if (!this._schema) return;

        if (this.ModelDB) {
            this.validObj = new this.ModelDB(data || this);
        } else {
            const Model = model('ValidateModel', this._schema, null, {overwriteModels: true});
            this.validObj = new Model(data || this);
        }

        this.validationResult = this.validObj.validateSync();

        if (returnValidObj) return this.validObj;
        return this.validationResult;
    }

    /**
     * Populates the schema fields with their default values if not provided in the input object.
     * @param {Object} [customSelf] - The custom object to be populated (optional, uses the instance itself by default).
     * @returns {Object} - The populated object with default values.
     */
    placeDefault(customSelf) {
        const self = customSelf || this;

        Object.entries(Object(this?._schema?.obj)).map(([key, field]) => {
            const selfCurrent = self[key];

            if (!selfCurrent && field.default){
                if (Boolean.isValid(field.default).function().eval()) self[key] = field.default();
                else self[key] = field.default;
            }
        });

        return self;
    }
}

module.exports = ValidateSchema;
