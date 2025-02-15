const Endpoint = require('4hands-api/src/models/settings/Endpoint');
const User = require('4hands-api/src/collections/Models/users.model');

/**
 * Represents a controller endpoint to reset the user's password
 * @name AuthResetPasswordSendEmail
 * @type {Endpoint}
 */
module.exports = new Endpoint({
    method: 'POST',
    routePath: '/auth/reset-password/send-email',
    bodySchema: {
        email: { type: String, required: true }
    },
    controller: async (req, res) => {
        const { email } = req.body;

        try {
            const user = await User.getUser({ email });
    
            if (!user) {
                return res.status(404).send(logError({
                    name: 'USER_DOES_NOT_EXIST',
                    message: `The user e-mail doesn't exist!`
                }));
            }
    
            // Generate the link and send the email
            const sent = await user.sendResetPassEmail(req);
    
            req.session.userEmail = user.email;
            return res.status(200).send(sent);
        } catch (err) {
            return res.status(500).send(toError(err));
        }
    }
});
