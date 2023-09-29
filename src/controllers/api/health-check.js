const Endpoint = require("@src/models/settings/Endpoint");

module.exports = new Endpoint({
    method: 'GET',
    routePath: '/api/health-check',
    controller: async (req, res) => {
        res.status(200).send({
            success: true,
            state: 'online'
        });
    }
});
