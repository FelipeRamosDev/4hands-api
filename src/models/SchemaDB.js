const mongoose = require('mongoose');
const { getGlobalSchema } = require('4hands-api/src/collections/_globals');
const RefConfig = require('./settings/SchemaRefConfig');
const { database: { dbHelpers }} = require('4hands-api/src/helpers');
const configs = require('4hands-api/configs/project');
const GlobalClass = require('4hands-api/src/collections/Class/_globals.class');
const FS = require('4hands-api/src/services/FS');
const path = require('path');

/**
 * Represents a schema for MongoDB database, including methods for initializing queries, events, and classes.
 * @module SchemaDB
 * @namespace Models
 * @param {Object} setup - The setup object containing schema details and configurations.
 * @throws {Error} If initialization fails.
 */
class SchemaDB {
    static RefConfig = RefConfig;

    constructor(setup) {
        const { name, symbol, excludeGlobals, redisEvents, fieldsSet } = Object(setup);
        const globalQueries = require('4hands-api/src/collections/queries/_globals.query');
        const globalEvents = require('4hands-api/src/collections/events/_globals.event');
        let { schema } = Object(setup);

        try {
            this.name = name;
            this.projectPath = path.normalize(__dirname.replace(path.normalize('/node_modules/4hands-api/src/models'), '/'));
            this.projectQueriesPath = path.normalize(`${this.projectPath}src/collections/queries/${this.name}.query.js`);
            this.projectEventsPath = path.normalize(`${this.projectPath}src/collections/events/${this.name}.event.js`);
            this.projectRedisEventsPath = path.normalize(`${this.projectPath}src/collections/redisEvents/${this.name}.event.js`);
            this.nativeQueriesPath = path.normalize(`${__dirname.replace(path.normalize('/models'), '/collections')}/queries/${this.name}.query.js`);
            this.nativeEventsPath = path.normalize(`${__dirname.replace(path.normalize('/models'), '/collections')}/events/${this.name}.event.js`);
            this.nativeClassesPath = path.normalize(`${__dirname.replace(path.normalize('/models'), '/collections')}/Class/${this.name}.class.js`);
            this.projectClassesPath = path.normalize(`${this.projectPath}src/collections/Class/${this.name}.class.js`);
            this.symbol = symbol;
            this.DB = null;
            this.globalEvents = globalEvents;
            this.nativeQueries = {...globalQueries};
            this.nativeEvents = {};
            this.queries = {};
            this.events = {};
            this.redisEvents = {};

            if (Array.isArray(fieldsSet)) {
                if (!schema) schema = {};
                this.fieldsSet = fieldsSet;

                fieldsSet.map(item => {
                    schema[item.fieldName] = item;
                });
            }

            this.schema = new mongoose.Schema({...getGlobalSchema(excludeGlobals), ...schema});
            if (redisEvents) {
                this.redisEvents = redisEvents;
            } else if (FS.isExist(this.projectRedisEventsPath)) {
                this.redisEvents = require(this.projectRedisEventsPath);
            }

            // Initializing queries, events and classes
            this.initQueries();
            this.initEvents();
            this.initRedisEvents();
            this.initClasses();

            // Initializing the collection
            const date = new Date();

            if (configs.database.consoleLogs.collectionLoaded) {
                console.log(`[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] Collection "${this.name}" was successful initialized!`)
            }
        } catch(err) {
            throw new Error.Log(err);
        }
    }

    /**
     * Initializes the schema and returns the initialized instance.
     * @param {Object} server - The server object to which the schema is associated.
     * @returns {SchemaDB} - The initialized SchemaDB instance.
     * @throws {Error} If initialization fails.
     */
    init(server) {
        try {
            if (this.name !== configs.database.counterCollection) dbHelpers.createCounter(this);

            const isDup = mongoose.modelNames().find(key => key === this.name);
            const isDupSymbol = server.collections.find(item => item.symbol === this.symbol);

            if (!isDup && !isDupSymbol) {
                this.DB = mongoose.model(this.name, this.schema);
            } else {
                const error = new Error.Log('database.duplicated_schema', this.name, this.symbol);
                if (isDup) error.append('database.duplicated_schema_name', this.name);
                if (isDupSymbol) error.append('database.duplicated_schema_symbol', this.symbol);
                throw error;
            }

            return this;
        } catch(err) {
            throw new Error.Log(err).append('database.schema_init');
        } 
    }

    /**
     * Initializes queries for the schema.
     * @private
     * @throws {Error} If query initialization fails.
     */
    initQueries() {
        try {
            // Adding global and custom queries
            if (FS.isExist(this.nativeQueriesPath)) {
                const nativeQueries = require(this.nativeQueriesPath);
                this.nativeQueries = { ...this.nativeQueries, ...nativeQueries };
            }

            if (FS.isExist(this.projectQueriesPath)) {
                const projectQueries = require(this.projectQueriesPath);

                if (projectQueries) {
                    this.queries = { ...this.nativeQueries, ...require(this.projectQueriesPath) };
                }
            }

            this.schema.query = this.queries;
        } catch(err) {
            throw new Error.Log(err).append('database.init_queries');
        }
    }

    /**
     * Initializes events for the schema.
     * @private
     * @throws {Error} If event initialization fails.
     */
    initEvents() {
        try {
            // Loading the native events
            if (FS.isExist(this.nativeEventsPath)) {
                const nativeEvents = require(this.nativeEventsPath);
                this.nativeEvents = { ...this.nativeEvents, ...nativeEvents };
            }

            // Loading the project events
            if (FS.isExist(this.projectEventsPath)) {
                const projectEvents = require(this.projectEventsPath);

                if (projectEvents) {
                    this.events = require(this.projectEventsPath);
                }
            }

            // Adding global events
            if (this.globalEvents) {
                const { preSave, postSave, preUpdateOne, postUpdateOne, preDelete, postDelete } = this.globalEvents;

                if (preSave) this.schema.pre('save', preSave);
                if (postSave) this.schema.post('save', postSave);
                if (preUpdateOne) this.schema.pre(['updateOne', 'findOneAndUpdate'], preUpdateOne);
                if (postUpdateOne) this.schema.post(['updateOne', 'findOneAndUpdate'], postUpdateOne);
                if (preDelete) this.schema.pre(['deleteOne', 'deleteMany'], preDelete);
                if (postDelete) this.schema.post(['deleteOne', 'deleteMany'], postDelete);
            }

            // Adding native events
            if (this.nativeEvents) {
                const { preSave, postSave, preUpdateOne, postUpdateOne, preDelete, postDelete } = this.nativeEvents;

                if (preSave) this.schema.pre('save', preSave);
                if (postSave) this.schema.post('save', postSave);
                if (preUpdateOne) this.schema.pre(['updateOne', 'findOneAndUpdate'], preUpdateOne);
                if (postUpdateOne) this.schema.post(['updateOne', 'findOneAndUpdate'], postUpdateOne);
                if (preDelete) this.schema.pre(['deleteOne', 'deleteMany'], preDelete);
                if (postDelete) this.schema.post(['deleteOne', 'deleteMany'], postDelete);
            }

            // Adding custom events for the schema
            if (this.events) {
                const { preSave, postSave, preUpdateOne, postUpdateOne, preDelete, postDelete } = this.events;
                
                if (preSave) this.schema.pre('save', preSave);
                if (postSave) this.schema.post('save', postSave);
                if (preUpdateOne) this.schema.pre('findOne', preUpdateOne);
                if (postUpdateOne) this.schema.post('findOne', postUpdateOne);
                if (preDelete) this.schema.pre(['updateOne', 'findOneAndUpdate'], preDelete);
                if (postDelete) this.schema.post(['updateOne', 'findOneAndUpdate'], postDelete);
            }
        } catch(err) {
            throw new Error.Log(err).append('database.init_events');
        }
    }

    /**
     * Initializes redis events for the schema.
     * @private
     * @throws {Error} If event initialization fails.
     */
    initRedisEvents() {
        const { preCreate, postCreate, preRead, postRead, preUpdate, postUpdate, preDelete, postDelete } = Object(this.redisEvents);

        try {
            if (preCreate) {
                process.on('redis:precreate:' + this.name, preCreate);
            }

            if (postCreate) {
                process.on('redis:postcreate:' + this.name, postCreate);
            }

            if (preRead) {
                process.on('redis:preread:' + this.name, preRead);
            }

            if (postRead) {
                process.on('redis:postread:' + this.name, postRead);
            }

            if (preUpdate) {
                process.on('redis:preupdate:' + this.name, preUpdate);
            }

            if (postUpdate) {
                process.on('redis:postupdate:' + this.name, postUpdate);
            }

            if (preDelete) {
                process.on('redis:predelete:' + this.name, preDelete);
            }

            if (postDelete) {
                process.on('redis:postdelete:' + this.name, postDelete);
            }
        } catch(err) {
            throw new Error.Log(err).append('database.init_events');
        }
    }

    /**
     * Initializes custom classes for the schema.
     * @private
     * @throws {Error} If class initialization fails.
     */
    initClasses() {
        try {
            // Loading global class
            this.schema.loadClass(GlobalClass);

            // Loading the schema custom classe
            if (FS.isExist(this.projectClassesPath)) {
                const ProjectClass = require(this.projectClassesPath);
                this.schema.loadClass(ProjectClass);
            } else if (FS.isExist(this.nativeClassesPath)) {
                const NativeClass = require(this.nativeClassesPath);
                this.schema.loadClass(NativeClass);
            }

            this.schema.set('toObject', {virtuals: true});
        } catch(err) {
            throw new Error.Log(err).append('database.init_classes');
        }
    }

    /**
     * Represents MongoDB schema object.
     * @static
     * @type {mongoose.Schema}
     */
    static mongoSchema = mongoose.Schema;
}

module.exports = SchemaDB;
