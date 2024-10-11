const User = require('4hands-api/src/collections/Models/users.model');
const Endpoint = require('4hands-api/src/models/settings/Endpoint');

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
                res.status(401).send(logError({
                    name: 'PASSWORD_NOT_MATCH',
                    message: 'The password confirmation need to be the same value of password!'
                }));
            } else {
                next();
            }
        }
    ],
    controller: async (req, res) => {
        try {
            const body = req.body;
            const newUser = await User.create(body, { confirmationEmail: true });
    
            if (newUser.error) {
                return res.status(401).send(newUser);
            }

            req.session.user = newUser.toPublic();
            req.session.confirmationToken = newUser.confirmationToken.toString('hex');
            req.session.isAuthorized = true;
            req.session.isEmailConfirmed = false;

            const response = await newUser.toSession(req.session);
            return res.status(200).send(response);
        } catch(err) {
            return res.status(500).send(logError(err));
        }
    }
});
