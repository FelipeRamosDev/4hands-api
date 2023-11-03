const User = require('@models/collections/User');
const Endpoint = require('@src/models/settings/Endpoint');

/**
 * Represents a controller endpoint for register an user.
 * @name AuthSignOut
 * @type {Endpoint}
 */
module.exports = new Endpoint({
    method: 'POST',
    routePath: '/auth/signout',
    isAuthRoute: true,
    controller: async (req, res) => {
        try {
            req.sessionStore.destroy(req.sessionID, (err, data) => {
                return res.status(200).send({ success: true });
            });
        } catch(err) {
            return res.status(500).send(new Error.Log(err).response());
        }
    }
});
