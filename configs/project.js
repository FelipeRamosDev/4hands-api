/**
 * Configuration class for the project.
 */
class ProjectConfig {
    /**
     * The mode of the project (e.g., development, production).
     * @type {string}
     */
    static mode = 'development';

    /**
     * The default language of the project.
     * @type {string}
     */
    static defaultLanguage = 'en_US';

    /**
     * The session age.
     * @type {number}
     */
    static sessionMaxAge = 3600000;

    /**
     * The default port for a socket server.
     * @type {number}
     */
    static socketServerPort = 5555;

    /**
     * Id cookies only accept from HTTPS
     * @type {number}
     */
    static secureCookies = false;

    /**
     * The database configuration.
     * @type {Object}
     * @property {string} counterCollection - The name of the counter collection in the database.
     * @property {string} logCollection - The name of the log collection in the database.
     * @property {Object} maxDeepLevels - The maximum deep levels configuration for the database.
     * @property {Object} consoleLogs - The console logs configuration for the database.
     * @property {boolean} consoleLogs.collectionLoaded - Indicates if the collection is loaded in console logs.
     */
    static database = {
        counterCollection: 'counters',
        logCollection: 'logs',
        maxDeepLevels: {},
        consoleLogs: {
            collectionLoaded: false
        }
    };
}

module.exports = ProjectConfig;
