const Endpoint = require('4hands-api/src/models/settings/Endpoint');

module.exports = new Endpoint({
    method: 'POST',
    routePath: '/testing/check',
    isAuthRoute: false,
    bodySchema: {
        toCheck: {
            type: String,
            required: true,
            enum: ['yes', 'no']
        }
    },
    controller: async (req, res) => {
        try {
            console.log('Did hit "testing/check" endpoint!');
            console.log('Params:', req.body);
    
            return res.status(200).send({
                success: true,
                didCheck: true
            });
        } catch (err) {
            return req.status(500).send({ error: true, message: err.message });
        }
    }
});
