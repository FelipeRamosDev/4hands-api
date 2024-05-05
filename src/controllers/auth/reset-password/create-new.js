const Endpoint = require('4hands-api/src/models/settings/Endpoint');
const User = require('4hands-api/src/models/collections/User');
const AuthService = require('4hands-api/src/services/Auth');

/**
 * Represents a controller endpoint to reset the user's password
 * @name AuthResetPasswordSendEmail
 * @type {Endpoint}
 */
module.exports = new Endpoint({
    method: 'PUT',
    routePath: '/auth/reset-password/create-new',
    bodySchema: {
        newPassword: { type: String, required: true },
        confirmPassword: { type: String, required: true },
        resettoken: { type: String, required: true },
        useremail: { type: String, required: true }
    },
    middlewares: [
        async (req, res, next) => {
            const { session, sessionStore, body } = req;
            const { resettoken, useremail } = Object(body);
            const authService = new AuthService();
        
            const tokenData = authService.validateToken(resettoken);
            if (!tokenData) {
                return res.status(401).send(logError('common.bad_params', 'resettoken'));
            }

            if (useremail !== tokenData.userEmail) {
                return res.status(401).send(logError('common.bad_params', 'useremail'));
            }

            sessionStore.get(tokenData.sessionID, (err, data) => {
                if (err) {
                    throw logError(err);
                }

                if (useremail !== data.userEmail) {
                    return res.status(401).send(logError('common.bad_params', 'session.userEmail'));
                }

                session.userSession = data;
                next();
            });
        }
    ],
    controller: async (req, res) => {
        const user = await User.getUser({ email: req.session?.userSession?.userEmail });
        const changed = await user.auth.changePassword(req.body.newPassword);

        return res.status(200).send(changed);
    }
});
