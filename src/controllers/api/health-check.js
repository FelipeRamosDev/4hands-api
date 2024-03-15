const Endpoint = require("4hands-api/src/models/settings/Endpoint");

/**
 * Represents a controller endpoint for to check if the API is connected and working properly.
 * @name ApiHealthCheck
 * @type {Endpoint}
 */
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
