const Endpoint = require('4hands-api/src/models/settings/Endpoint');
const FS = require('4hands-api/src/services/FS');
const CONSOLE_OUTPUT_FILE = 'output.log';

/**
 * Represents a controller endpoint for to check if the API is connected and working properly.
 * @name ApiReadLogs
 * @type {Endpoint}
 */
module.exports = new Endpoint({
    method: 'GET',
    routePath: '/api/read-logs',
    controller: async (req, res) => {
        const isLogFileExist = FS.isExist(CONSOLE_OUTPUT_FILE);
        if (!isLogFileExist) {
            res.status(404).send(logError({
                name: 'LOGS_FILE_NOT_FOUND',
                message: `The logs fole wasn't found on the server.`
            }));
        }

        const logs = await FS.readFile(CONSOLE_OUTPUT_FILE);
        const logsString = logs.toString('utf-8');

        res.status(200).send({
            success: true,
            content: logsString
        });
    }
});
