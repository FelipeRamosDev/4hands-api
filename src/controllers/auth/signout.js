const Endpoint = require('4hands-api/src/models/settings/Endpoint');

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
            // req.session.destroy() deletes req.session before returning,
            // which prevents express-session's auto-save hook from recreating the session.
            req.session.destroy((err) => {
                if (err) return res.status(500).send({ error: true, message: err.message });
                return res.status(200).send({ success: true });
            });
        } catch(err) {
            return res.status(500).send({ error: true, message: err.message });
        }
    }
});
