const Endpoint = require('../../models/settings/Endpoint');

/**
 * Represents a controller endpoint to confirm email of user.
 * @name AuthConfirmEmail
 * @type {Endpoint}
 */
module.exports = new Endpoint({
   method: 'GET',
   routePath: '/auth/auth-check',
   isAuthRoute: true,
   controller: async (req, res) => {
      try {
         const session = req.session;
         res.status(200).send({ isLogged: true, user: session.user });
      } catch (err) {
         return res.status(500).send(toError(err));
      }
   }
});
