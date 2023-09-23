const {Schema, model} = require('mongoose');

class ValidateSchema {
    constructor(rules) {
        const schemas = require('../schemas');

        // Initializing the schema
        if (Boolean.isValid(rules).stringFilled()) {
            // If the rules provided is a string with the collection name, and this collection name is a valid name. It will use it as schema.
            if (Boolean.isValid(schemas).path(rules + '.schema').objectFilled()) {
                this.ModelDB = schemas[rules].DB
                this._schema = schemas[rules].schema;
            } else {
                throw new Error.Log('common.request_model_schema_not_found', rules);
            }
        }
        
        if (Boolean.isValid(rules).objectFilled()) {
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
                throw new Error.Log(err).append('common.request_creating_custom_schema');
            }
        }
    }

    validate(data, returnValidObj) {
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

    placeDefault(customSelf) {
        const self = customSelf || this;

        Object.entries(this._schema.obj).map(([key, field]) => {
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
