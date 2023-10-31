const User = require('@models/collections/User');
const Endpoint = require('@src/models/settings/Endpoint');

/**
 * Represents a controller endpoint for register an user.
 * @name AuthRegister
 * @type {Endpoint}
 */
module.exports = new Endpoint({
    method: 'POST',
    routePath: '/auth/confirm-email',
    isAuthRoute: true,
    bodySchema: { confirmationtoken: { type: String, required: true } },
    controller: async (req, res) => {
        try {
            const user = await User.getUser(req.session?.user?._id);
            const updated = await user.updateDB({ data: { isEmailConfirmed: true }});

            if (updated instanceof Error.Log) {
                throw updated;
            }

            req.sessionStore.destroy(req.sessionID);
            res.status(200).send({ success: true });
        } catch(err) {
            return res.status(500).send(new Error.Log(err).response());
        }
    }
});
