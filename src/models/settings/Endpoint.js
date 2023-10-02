const authVerify = require('@middlewares/authVerify');
const bodyValidation = require('@middlewares/bodyValidation');

/**
 * Represents an API endpoint configuration.
 * @class Endpoint
 */
class Endpoint {
    /**
     * Creates a new instance of the Endpoint class.
     * @param {Object} setup - The setup object containing endpoint details and configurations.
     * @param {string} setup.method - The HTTP method for the endpoint (default: 'GET').
     * @param {string} setup.routePath - The path of the endpoint's route.
     * @param {function} setup.controller - The controller function handling the endpoint logic.
     * @param {Object} setup.bodySchema - The schema object for validating the request body.
     * @param {boolean} setup.isAuthRoute - Indicates if the endpoint requires authentication.
     * @param {string} setup.authRule - The authorization rule for the authenticated users.
     * @param {function[]} setup.middlewares - Additional middlewares to be applied to the endpoint.
     * @param {boolean} setup.noValidateBody - Indicates if request body validation should be skipped.
     * @throws {Error.Log} If setup parameters are invalid.
     */
    constructor(setup) {
        const { method, routePath, controller, bodySchema, isAuthRoute, authRule, middlewares, noValidateBody } = Object(setup);

        // Validation checks for required parameters
        if (!routePath) {
            throw new Error.Log({
                name: 'ROUTE_REQUIRED',
                message: 'The "routePath" param is required to declare a new endpoint!'
            });
        }

        if (typeof controller !== 'function') {
            throw new Error.Log({
                name: 'CONTROLLER_REQUIRED',
                message: 'The "controller" param is required to be a function when declaring a new endpoint!'
            });
        }

        /**
         * The HTTP method for the endpoint.
         * @type {string}
         */
        this.method = method || 'GET';

        /**
         * The path of the endpoint's route.
         * @type {string}
         */
        this.routePath = routePath;

        /**
         * The controller function handling the endpoint logic.
         * @type {function}
         */
        this.controller = controller;

        /**
         * Middleware functions to be applied to the endpoint.
         * @type {function[]}
         */
        this.middlewares = [];

        // Adding authentication middleware if required
        if (isAuthRoute) {
            this.authRule = authRule;
            this.middlewares.push(authVerify);
        }

        // Adding body validation middleware if body schema provided and validation is not skipped
        if (bodySchema && !noValidateBody) {
            this.bodySchema = Object(bodySchema);
            this.middlewares.push((req, res, next) => {
                bodyValidation(req, res, next, this.bodySchema);
            });
        }

        // Adding custom middlewares to the endpoint
        if (Array.isArray(middlewares)) {
            middlewares.forEach(item => {
                if (typeof item === 'function') {
                    this.middlewares.push(item);
                }
            });
        }
    }
}

module.exports = Endpoint;
