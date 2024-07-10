const User = require('../../collections/Models/users.model');
const Endpoint = require('../../models/settings/Endpoint');
const AuthService = require('../../services/Auth');

/**
 * Represents a controller endpoint to send the confirmation email to the user.
 * @name AuthSendEmailConfirm
 * @type {Endpoint}
 */
module.exports = new Endpoint({
    method: 'POST',
    routePath: '/auth/send-email-confirm',
    bodySchema: {
        userEmail: { type: String, required: true }
    },
    controller: async (req, res) => {
        try {
            const { sessionStore, headers } = req;
            const authService = new AuthService();
            const user = await User.getUser({ email: req.body?.userEmail });
            const emailSent = await user.sendConfirmationEmail();

            if (!emailSent.success || emailSent.error) {
                throw emailSent
            }

            const tokenData = authService.validateToken(headers.token);
            if (!tokenData) {
                return res.status(401).send(notAuthorizedError);
            }

            sessionStore.get(tokenData.sessionID, async (err, data) => {
                if (err || !data || !data.isAuthorized) {
                    if (!data) {
                        delete req.session.user;
                        delete req.session.isAuthorized;
                        delete req.session.sessionSalt;
                    }
        
                    return res.status(401).send(notAuthorizedError);
                }

                data.confirmationToken = emailSent.confirmationToken;
                delete emailSent.confirmationToken;

                sessionStore.set(tokenData.sessionID, data, () => {
                    res.status(200).send(emailSent);
                });
            });
        } catch(err) {
            return res.status(500).send(logError(err));
        }
    }
});
