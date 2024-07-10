const Endpoint = require('4hands-api/src/models/settings/Endpoint');
const FS = require('4hands-api/src/services/FS');
const PATHS = {
    'console-log': 'console.log',
    'errors': 'errors.log',
}

/**
 * Represents a controller endpoint for to check if the API is connected and working properly.
 * @name ApiReadLogs
 * @type {Endpoint}
 */
module.exports = new Endpoint({
    method: 'GET',
    routePath: '/api/read-logs',
    bodySchema: { type: { type: String, default: 'console-log' }},
    controller: async (req, res) => {
        try {
            const { type } = Object(req.body);
            const path = PATHS[type];
            const isLogFileExist = FS.isExist(path);

            if (!isLogFileExist) {
                return res.status(404).send(toError({
                    name: 'LOGS_FILE_NOT_FOUND',
                    message: `The logs fole wasn't found on the server.`
                }));
            }
    
            const logs = await FS.readFile(path);
            const logsString = logs.toString('utf-8');
    
            return res.status(200).send({
                success: true,
                content: logsString
            });
        } catch (err) {
            return res.status(500).send(toError(err));
        }
    }
});
