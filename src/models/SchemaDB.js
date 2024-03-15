const mongoose = require('mongoose');
const { getGlobalSchema } = require('4hands-api/src/schemas/_globals');
const schemasClass = require('4hands-api/src/schemas/class');
const RefConfig = require('./settings/SchemaRefConfig');
const { database: { dbHelpers, queries, events }} = require('4hands-api/src/helpers');
const configs = require('4hands-api/configs/project');
const GlobalClass = schemasClass.GlobalClass;
const customQueries = require('4hands-api/src/schemas/queries');
const customEvents = require('4hands-api/src/schemas/events');
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

    constructor(setup = {
        name: String(),
        symbol: String(),
        schema: mongoose.SchemaTypeOptions.prototype,
        excludeGlobals: [],
        links: Object(),
        queries: Object(),
        events: Object(),
        redisEvents: Object()
    }) {
        try {
            this.name = setup.name;
            this.projectPath = path.normalize(__dirname.replace(path.normalize('/node_modules/4hands-api/src/models'), '/'));
            this.projectQueriesPath = path.normalize(`${this.projectPath}src/collections/queries/${this.name}.query.js`);
            this.projectEventsPath = path.normalize(`${this.projectPath}src/collections/events/${this.name}.event.js`);
            this.projectRedisEventsPath = path.normalize(`${this.projectPath}src/collections/redisEvents/${this.name}.event.js`);
            this.projectClassesPath = path.normalize(`${this.projectPath}src/collections/Class/${this.name}.class.js`);
            this.symbol = setup.symbol;
            this.DB = null;

            if (Array.isArray(setup.fieldsSet)) {
                if (!setup.schema) setup.schema = {};
                this.fieldsSet = setup.fieldsSet;

                setup.fieldsSet.map(item => {
                    setup.schema[item.fieldName] = item;
                });
            }

            this.schema = new mongoose.Schema({...getGlobalSchema(setup.excludeGlobals), ...setup.schema});

            if (setup.queries) {
                this.queries = setup.queries;
            } else if (FS.isExist(this.projectQueriesPath)) {
                this.queries = require(this.projectQueriesPath);
            } else {
                this.queries = Object(customQueries[this.name]);
            }

            if (setup.events) {
                this.events = setup.events;
            } else if (FS.isExist(this.projectEventsPath)) {
                this.events = require(this.projectEventsPath);
            } else {
                this.events = Object(customEvents[this.name]);
            }

            if (setup.redisEvents) {
                this.redisEvents = setup.redisEvents;
            } else if (FS.isExist(this.projectRedisEventsPath)) {
                this.redisEvents = require(this.projectRedisEventsPath);
            } else {
                this.redisEvents = Object(customEvents[this.name]);
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
            this.schema.query = {...this.schema.query, ...queries, ...this.queries};
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
            // Adding global event
            this.schema.pre('save', events.preSave);
            this.schema.post('save', events.postSave);
            this.schema.pre(['updateOne', 'findOneAndUpdate'], events.preUpdateOne);
            this.schema.post(['updateOne', 'findOneAndUpdate'], events.postUpdateOne);
            this.schema.pre(['deleteOne', 'deleteMany'], events.preDelete);
            this.schema.post(['deleteOne', 'deleteMany'], events.postDelete);

            // Adding custom events for the schema
            if (this.events.preSave) this.schema.pre('save', this.events.preSave);
            if (this.events.postSave) this.schema.post('save', this.events.postSave);
            if (this.events.preFindOne) this.schema.pre('findOne', this.events.preFindOne);
            if (this.events.postFindOne) this.schema.post('findOne', this.events.postFindOne);
            if (this.events.preUpdate) this.schema.pre(['updateOne', 'findOneAndUpdate'], this.events.preUpdate);
            if (this.events.postUpdate) this.schema.post(['updateOne', 'findOneAndUpdate'], this.events.postUpdate);
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
            const Custom = schemasClass[this.name];

            // Loading global class
            this.schema.loadClass(GlobalClass);

            // Loading the schema custom classe
            if (FS.isExist(this.projectClassesPath)) {
                const ProjectClass = require(this.projectClassesPath);
                this.schema.loadClass(ProjectClass);
            } else if (Custom) {
                this.schema.loadClass(Custom);
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
