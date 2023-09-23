const authVerify = require('@middlewares/authVerify');
const bodyValidation = require('@middlewares/bodyValidation');

class Endpoint {
    constructor (setup) {
        const { method, routePath, controller, bodySchema, isAuthRoute, authRule, middlewares, noValidateBody } = Object(setup);

        if (!routePath) {
            throw new Error.Log({
                name: 'ROUTE_REQUIRED',
                message: 'The "routePath" param is required to declare a new endpoint!'
            });
        }

        if (typeof controller !== 'function') {
            throw new Error.Log({
                name: 'CONTROLLER_REQUIRED',
                message: 'The "controller" param is required to be a function on declaring a new endpoint!'
            });
        }

        this.method = method || 'GET';
        this.routePath = routePath;
        this.controller = controller;
        this.middlewares = [];

        if (isAuthRoute) {
            this.authRule = authRule;
            this.middlewares.push(authVerify);
        }

        if (bodySchema && !noValidateBody) {
            this.bodySchema = Object(bodySchema);
            this.middlewares.push((req, res, next) => {
                bodyValidation(req, res, next, this.bodySchema);
            });
        }

        if (Array.isArray(middlewares)) {
            middlewares.map(item => {
                if (typeof middlewares !== 'function') {
                    return;
                }

                this.middlewares.push(item);
            });
        }
    }
}

module.exports = Endpoint;
