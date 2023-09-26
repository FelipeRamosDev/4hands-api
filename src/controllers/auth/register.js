const User = require('@models/collections/User');
const Endpoint = require('@src/models/settings/Endpoint');

module.exports = new Endpoint({
    method: 'POST',
    routePath: '/auth/register',
    bodySchema: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        confirmPassword: { type: String, required: true }
    },
    controller: async (req, res) => {
        try {
            const body = req.body;
            const newUser = await User.create(body);
    
            if (newUser instanceof Error.Log) {
                return res.status(500).send(newUser.toJSON());
            }
    
            const toPublic = newUser.data.toPublic();
            toPublic.token = newUser.data.token;
    
            return res.status(200).send(toPublic.toSuccess().toJSON());
        } catch(err) {
            return res.status(500).send(new Error.Log(err).toJSON());
        }
    }
});
