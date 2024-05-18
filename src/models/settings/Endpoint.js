const authVerify = require('4hands-api/src/middlewares/authVerify');
const bodyValidation = require('4hands-api/src/middlewares/bodyValidation');

/**
 * Represents an API endpoint configuration.
 * @class Endpoint
 * @namespace Models
 */
class Endpoint {
    /**
     * Creates a new instance of the Endpoint class.
     * @param {Object} setup - The setup object containing endpoint details and configurations.
     * @param {string} setup.method - The HTTP method for the endpoint (default: 'GET').
     * @param {string} setup.routePath - The path of the endpoint's route.
     * @param {string[]} setup.rules - The allowed user rules for the endpoint.
     * @param {function} setup.controller - The controller function handling the endpoint logic.
     * @param {Object} setup.bodySchema - The schema object for validating the request body.
     * @param {boolean} setup.isAuthRoute - Indicates if the endpoint requires authentication.
     * @param {string} setup.authRule - The authorization rule for the authenticated users.
     * @param {function[]} setup.middlewares - Additional middlewares to be applied to the endpoint.
     * @param {boolean} setup.noValidateBody - Indicates if request body validation should be skipped.
     * @throws {Error.Log} If setup parameters are invalid.
     */
    constructor(setup) {
        const { method, routePath, rules, controller, bodySchema, isAuthRoute, authRule, middlewares, noValidateBody } = Object(setup);

        // Validation checks for required parameters
        if (!routePath) {
            throw logError({
                name: 'ROUTE_REQUIRED',
                message: 'The "routePath" param is required to declare a new endpoint!'
            });
        }

        // Validation checks for required parameters
        if (rules && !Array.isArray(rules)) {
            throw logError('common.bad_params');
        }

        if (typeof controller !== 'function') {
            throw logError({
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
         * The allowed user rules for the endpoint.
         * @type {string[]}
         */
        this.rules = rules;

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

            // Validation the user rules
            if (this.rules && this.rules.length) {
                this.middlewares.push(this.validateRule.bind(this));
            }
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

    /**
     * Updated the body schema of the endpoint.
     * @param {object} data 
     */
    updateBodySchema(data) {
        this.bodySchema = {...this.bodySchema, ...data};
    }

    /**
     * This asynchronous function validates the user's rules.
     * 
     * @param {Object} req - The request object, containing session information and user rules.
     * @param {Object} res - The response object, used to send responses back to the client.
     * @param {Function} next - The next middleware function in the Express.js routing process.
     * 
     * @returns {Object} If the user's rules are not found in the system rules, it returns a 401 status code with an error message. Otherwise, it calls the next middleware function.
     */
    async validateRule(req, res, next) {
        const userRules = req.session.user?.rules;
        const searchRules = this.rules.find(rule => {
            const searchUserRules = userRules?.find(userRule => userRule === rule);
            return searchUserRules;
        });

        if (!searchRules) {
            return res.status(401).send(toError({
                name: 'USER_RULE_NOT_AUTHORIZED',
                message: `User's rules is not allowed for this endpoint!`
            }));
        }

        next();
    }
}

module.exports = Endpoint;
