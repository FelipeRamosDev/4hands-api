const mongoose = require('mongoose');
const counters = require('4hands-api/src/collections/counters');
const safe_values = require('4hands-api/src/collections/safe_values');
const CollectionBucket = require('../CollectionBucket');

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
    constructor(setup, _4handsInstance) {
        const { dbName, HOST, collections = [], onReady, onError } = Object(setup);

        /**
         * The main 4hands-api instance.
         * @type {Object}
         */
        this._4handsInstance = () => _4handsInstance;

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
         * A Map containing the initialized collections.
         * @type {CollectionBucket}
         */
        this.collections = new CollectionBucket([
            counters,
            safe_values,
            ...collections
        ], this);

        /**
         * Callback for when the database is connected.
         * @type {Function}
         */
        this._onReady = (...args) => {
            if (typeof onReady === 'function') {
                onReady.call(this, ...args);
            }
        }

        /**
         * Callback for when the database get an error on connection.
         * @type {Function}
         */
        this._onError = (err, ...args) => {
            if (typeof onError === 'function') {
                onError.call(this, err, ...args);
            }
        }

        this.collections.initDB();
    }

    /**
     * The main 4hands-api instance.
     * @property {Object}
     */
    get parent() {
        return this._4handsInstance();
    }

    /**
     * Initializes the database connection and sets up the collections.
     * @param {Object} callbacks - Success and error callbacks for database initialization.
     * @param {Function} callbacks.success - The success callback function to be executed after successful database connection.
     * @param {Function} callbacks.error - The error callback function to be executed if the database connection fails.
     * @returns {DatabaseServer} The DatabaseServer instance.
     */
    init({ success = () => {}, error = () => {} }) {
        mongoose.set('strictQuery', false);
        mongoose.connect(this.HOST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: this.dbName
        }).then(async (connectedDB) => {
            console.log(`>> Database ${this.dbName}: "${this.HOST}"`);

            this.DBServer = connectedDB;
            success(connectedDB);
            this._onReady(connectedDB);
        }).catch(err => {
            console.error('An error occurred while connecting to the database: ', JSON.stringify(err, null, 2));
            this._onError(err);
        });

        return this;
    }
}

module.exports = DatabaseServer;
