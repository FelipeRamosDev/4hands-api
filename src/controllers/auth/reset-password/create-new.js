const Endpoint = require('@models/settings/Endpoint');
const User = require('@models/collections/User');
const AuthService = require('@services/Auth');

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
                debugger 
            }

            if (useremail !== tokenData.userEmail) {
                debugger
            }

            sessionStore.get(tokenData.sessionID, (err, data) => {
                if (err) {
                    debugger 
                }

                if (useremail !== data.userEmail) {
                    debugger
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
