const Endpoint = require('@models/settings/Endpoint');
const User = require('@models/collections/User');
const Configs = require('@config');

/**
 * Represents a controller endpoint to authenticate an user.
 * @name AuthLogin
 * @type {Endpoint}
 */
module.exports = new Endpoint({
    method: 'POST',
    routePath: '/auth/login',
    bodySchema: {
        email: { type: String, required: true },
        password: { type: String, required: true }
    },
    middlewares: [
        async (req, res, next) => {
            try {
                const body = req.body;
                const user = await User.signIn(body.email, body.password);
        
                if (user instanceof Error.Log) {
                    let status = 500;
        
                    if (user.name === 'AUTH_INVALID_CREDENTIALS') {
                        status = 401;
                    }
        
                    return res.status(status).send(user.response());
                }
        
                
                const response = await user.toSession(req.session);
    
                req.session.user = response;
                req.session.isAuthorized = true;
                req.session.isEmailConfirmed = user.isEmailConfirmed;
                return next();
            } catch(err) {
                return res.status(500).send(new Error.Log(err).response());
            }
        }
    ],
    controller: async (req, res) => {
        return res.status(200).send(req.session.user);
    }
});
