const ValidateSchema = require('../validation/validateSchema');

/**
 * Represents an API request handler which validates incoming request body against provided schema.
 * @module RequestAPI
 * @extends ValidateSchema
 * @namespace Models
 * @param {Object} request - The request object.
 * @param {Object} bodySchema - The schema object to validate the request body against.
 * @throws {ValidationError} If the request body fails schema validation.
 * @property {Object} originalRequest - The original request object.
 * @property {Object} body - The validated request body object.
 */
class RequestAPI extends ValidateSchema {
    /**
     * Creates a new instance of the RequestAPI class.
     * @param {Object} request - The request object.
     * @param {Object} bodySchema - The schema object to validate the request body against.
     * @throws {ValidationError} If the request body fails schema validation.
     */
    constructor(request, bodySchema) {
        super(bodySchema);

        /**
         * The original request object.
         * @property {Object}
         */
        this.originalRequest = request;

        /**
         * The validated request body object.
         * @property {Object}
         */
        const Model = Boolean.isValid(this._schema).path('statics.Model').eval();
        if (Model) {
            this.body = new Model(request.body || {});
        } else {
            const blendBody = {...request.query, ...request.body};
            const hasError = this.validate(blendBody);

            if (!hasError) {
                this.body = blendBody;

                Object.keys(request.query).map(key => {
                    const value = request.query[key];

                    if (typeof value === 'string') {
                        try {
                            this.body[key] = JSON.parse(value);
                        } catch (error) {
                            this.body[key] = value;
                        }
                    } else {
                        this.body[key] = value;
                    }

                });
            } else {
                throw hasError;
            }
        }
    }

    /**
     * Returns the validated request body object with any default values applied.
     * @method
     * @returns {Object} - The validated request body object.
     */
    getBody() {
        return this.placeDefault(this.body);
    }
}

module.exports = RequestAPI;
