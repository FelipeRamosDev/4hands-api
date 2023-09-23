const ValidateSchema = require('../validation/validateSchema');

/**
 * @class
 * @classdesc Represents an API request handler which validates incoming request body against provided schema.
 * @extends ValidateSchema
 * @param {Object} request - The request object.
 * @param {Object} bodySchema - The schema object to validate the request body against.
 * @throws {ValidationError} If the request body fails schema validation.
 * @property {Object} originalRequest - The original request object.
 * @property {Object} body - The validated request body object.
 * @method getBody - Returns the validated request body object with any default values applied.
 */
class RequestAPI extends ValidateSchema {
    constructor(request, bodySchema) {
        super(bodySchema);

        const Model = Boolean.isValid(this._schema).path('statics.Model').eval();
        this.originalRequest = request;

        if (Model) {
            this.body = new Model(request.body || {});
        } else {
            const hasError = this.validate(request.body);

            if (!hasError) {
                this.body = request.body;
            } else {
                throw hasError;
            }
        }
    }

    getBody() {
        return this.placeDefault(this.body);
    }
}

module.exports = RequestAPI;
