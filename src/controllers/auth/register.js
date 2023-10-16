const User = require('@models/collections/User');
const Endpoint = require('@src/models/settings/Endpoint');

/**
 * Represents a controller endpoint for register an user.
 * @name AuthRegister
 * @type {Endpoint}
 */
module.exports = new Endpoint({
    method: 'POST',
    routePath: '/auth/register',
    bodySchema: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        password: { type: String, required: true },
        confirmPassword: { type: String, required: true }
    },
    middlewares: [
        function (req, res, next) {
            const { password, confirmPassword } = Object(req.body);

            if (password !== confirmPassword) {
                res.status(400).send(new Error.Log({
                    name: 'PASSWORD_NOT_MATCH',
                    message: 'The password confirmation need to be the same value of password!'
                }).response());
            } else {
                next();
            }
        }
    ],
    controller: async (req, res) => {
        try {
            const body = req.body;
            const newUser = await User.create(body);
    
            if (newUser instanceof Error.Log) {
                return res.status(500).send(newUser.response());
            }

            req.session.user = newUser;
            req.session.isAuthorized = true;
    
            return res.status(200).send({...newUser, sessionID: req.session.id});
        } catch(err) {
            return res.status(500).send(new Error.Log(err).response());
        }
    }
});
