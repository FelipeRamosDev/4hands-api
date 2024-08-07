const User = require('../../collections/Models/users.model');
const Endpoint = require('../../models/settings/Endpoint');

/**
 * Represents a controller endpoint to confirm email of user.
 * @name AuthConfirmEmail
 * @type {Endpoint}
 */
module.exports = new Endpoint({
    method: 'POST',
    routePath: '/auth/confirm-email',
    isAuthRoute: true,
    bodySchema: { confirmationtoken: { type: String, required: true } },
    controller: async (req, res) => {
        try {
            const body = req.body;
            const data = req.session;
            const user = await User.getUser(req.session?.user?._id);
            
            if (body.confirmationtoken === data.confirmationToken) {
                const updated = await user.updateDB({ data: { isEmailConfirmed: true }});
    
                if (updated.error) {
                    throw updated;
                }

                data.isEmailConfirmed = true;
            } else {
                data.isEmailConfirmed = false;
                return res.status(401).send(badConfirmationToken);
            }

            req.sessionStore.destroy(req.sessionID);
            res.status(200).send({ success: true });
        } catch(err) {
            return res.status(500).send(toError(err));
        }
    }
});
