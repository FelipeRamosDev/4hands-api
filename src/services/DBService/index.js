const mongoose = require('mongoose');
const counters = require('../../collections/counters');
const CollectionBucket = require('../CollectionBucket');
const CRUD = require('./CRUD');

/**
 * Represents a database server with specified configurations and collections.
 * @module DBService
 * @namespace Services
 */
class DBService {
    /**
     * Creates an instance of DatabaseServer.
     * @constructor
     * @param {Object} setup - The configuration setup for the database server.
     * @param {string} setup.dbName - The name of the database.
     * @param {Function} setup.onReady - On ready callback.
     * @param {Function} setup.onError - On error callback.
     * @param {string} [setup.hostURL='mongodb://0.0.0.0:27017/'] - The host URL for the MongoDB server.
     * @param {Array} [setup.collections] - Additional collections to be initialized along with the default ones.
     */
    constructor(setup, _4handsInstance) {
        const {
            dbName,
            onReady,
            onError,
            hostURL = 'mongodb://0.0.0.0:27017/',
            collections = [],
        } = Object(setup);

        /**
         * The main 4hands-api instance.
         * @type {Object}
         */
        this._4handsInstance = () => _4handsInstance;

        /**
         * The host URL for the MongoDB server.
         * @type {string}
         */
        this.hostURL = hostURL;

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
        this.collections = new CollectionBucket([ counters, ...collections ], this);

        /**
         * A Map containing the initialized collections.
         * @type {CRUD}
         */
        this.CRUD = new CRUD(this);

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
        mongoose.connect(this.hostURL, {
            dbName: this.dbName
        }).then(async (connectedDB) => {
            this.parent.toConsole(`Database "${this.dbName}" is connected on: "${this.hostURL}"`);

            this.DBServer = connectedDB;
            success(connectedDB);
            this._onReady(connectedDB);
        }).catch(err => {
            console.error('An error occurred while connecting to the database: ', JSON.stringify(err, null, 2));
            error(err);
            this._onError(err);
        });

        return this;
    }

    /**
     * Retrieve a collection by it's name.
     * @param {string} name 
     * @returns {Collection}
     */
    getCollection(name) {
        return this.collections.getCollection(name);
    }
}

module.exports = DBService;
