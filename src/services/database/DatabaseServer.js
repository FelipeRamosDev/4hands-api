const mongoose = require('mongoose');
const counters = require('4hands-api/src/schemas/counters');
const logs = require('4hands-api/src/schemas/logs');
const safe_values = require('4hands-api/src/schemas/safe_values');

/**
 * Represents a database server with specified configurations and collections.
 * @module DatabaseServer
 * @namespace Services
 */
class DatabaseServer {
    /**
     * Creates an instance of DatabaseServer.
     * @constructor
     * @param {Object} setup - The configuration setup for the database server.
     * @param {string} setup.dbName - The name of the database.
     * @param {string} [setup.HOST='mongodb://0.0.0.0:27017/'] - The host URL for the MongoDB server.
     * @param {Array} [setup.collections] - Additional collections to be initialized along with the default ones.
     */
    constructor(setup) {
        const { dbName, HOST, collections } = Object(setup);

        /**
         * The host URL for the MongoDB server.
         * @type {string}
         */
        this.HOST = HOST || 'mongodb://0.0.0.0:27017/';

        /**
         * The name of the database.
         * @type {string}
         */
        this.dbName = dbName;

        /**
         * The MongoDB server instance.
         * @type {mongoose.Connection}
         */
        this.DBServer;

        /**
         * An array containing the initialized collections.
         * @type {Array}
         */
        this.collections = [];

        // Initialize default collections
        this.collections.push(counters.init(this));
        this.collections.push(logs.init(this));
        this.collections.push(safe_values.init(this));

        // Initialize additional collections, if provided
        if (Array.isArray(collections)) {
            collections.map(collection => this.collections.push(collection.init(this)));
        }
    }

    /**
     * Initializes the database connection and sets up the collections.
     * @param {Object} callbacks - Success and error callbacks for database initialization.
     * @param {Function} callbacks.success - The success callback function to be executed after successful database connection.
     * @param {Function} callbacks.error - The error callback function to be executed if the database connection fails.
     * @returns {DatabaseServer} The DatabaseServer instance.
     */
    init({ success, error }) {
        mongoose.set('strictQuery', false);
        mongoose.connect(this.HOST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: this.dbName
        }).then(async (connectedDB) => {
            console.log(`>> Database ${this.dbName}: "${this.HOST}"`);

            this.DBServer = connectedDB;
            success(connectedDB);
        }).catch(err => {
            console.error('An error occurred while connecting to the database: ', JSON.stringify(err, null, 2));
            error(err);
        });

        return this;
    }
}

module.exports = DatabaseServer;
