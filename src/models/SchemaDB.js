const mongoose = require('mongoose');
const { getGlobalSchema } = require('4hands-api/src/collections/_globals');
const RefConfig = require('./settings/SchemaRefConfig');
const { database: { dbHelpers }} = require('4hands-api/src/helpers');
const configs = require('4hands-api/configs/project');
const GlobalClass = require('4hands-api/src/collections/Models/_globals.model');
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
            this.nativeClassesPath = path.normalize(`${__dirname.replace(path.normalize('/models'), '/collections')}/Models/${this.name}.model.js`);
            this.projectClassesPath = path.normalize(`${this.projectPath}src/collections/Models/${this.name}.model.js`);
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
            throw logError(err);
        }
    }

    /**
     * Initializes the schema and returns the initialized instance.
     * @param {Object} server - The server object to which the schema is associated.
     * @returns {SchemaDB} - The initialized SchemaDB instance.
     * @throws {Error} If initialization fails.
     */
    initDB() {
        try {
            if (this.name !== configs.database.counterCollection) dbHelpers.createCounter(this);

            const isDup = mongoose.modelNames().find(key => key === this.name);

            if (!isDup) {
                this.DB = mongoose.model(this.name, this.schema);
            } else {
                const error = logError('database.duplicated_schema', this.name, this.symbol);
                if (isDup) error.append('database.duplicated_schema_name', this.name);
                throw error;
            }

            return this;
        } catch(err) {
            throw logError(err);
        } 
    }

    /**
     * Initializes queries for the schema.
     * @throws {Error} If query initialization fails.
     */
    initQueries() {
        try {
            // Adding global and custom queries
            if (FS.isExist(this.nativeQueriesPath)) {
                const nativeQueries = require(this.nativeQueriesPath);
                this.queries = { ...this.nativeQueries, ...nativeQueries };
            }

            if (FS.isExist(this.projectQueriesPath)) {
                const projectQueries = require(this.projectQueriesPath);

                if (projectQueries) {
                    this.queries = { ...this.nativeQueries, ...projectQueries };
                }
            }

            this.schema.query = this.queries;
        } catch(err) {
            throw logError(err);
        }
    }

    /**
     * Initializes events for the schema.
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
            this.addEventsToSchema(this.globalEvents);
            // Adding native events
            this.addEventsToSchema(this.nativeEvents);
            // Adding custom events for the schema
            this.addEventsToSchema(this.events);
        } catch(err) {
            throw logError(err);
        }
    }

    /**
     * Initializes redis events for the schema.
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
            throw logError(err);
        }
    }

    /**
     * Initializes custom classes for the schema.
     * @throws {Error} If class initialization fails.
     */
    initClasses() {
        try {
            // Loading global class
            this.schema.loadClass(GlobalClass);

            // Loading the schema custom classe
            if (FS.isExist(this.projectClassesPath)) {
                this.DefaultModel = require(this.projectClassesPath);
                this.schema.loadClass(this.DefaultModel);
            }
            
            if (FS.isExist(this.nativeClassesPath)) {
                this.DefaultModel = require(this.nativeClassesPath);
                this.schema.loadClass(this.DefaultModel);
            }

            this.schema.set('toObject', {virtuals: true});
        } catch(err) {
            throw logError(err);
        }
    }

    addEventsToSchema(events) {
        const { preRead, postRead, preSave, postSave, preUpdate, postUpdate, preDelete, postDelete } = Object(events);

        if (preRead) this.schema.pre(['find', 'findOne'], preRead);
        if (postRead) this.schema.pre(['find', 'findOne'], postRead);
        if (preSave) this.schema.pre('save', preSave);
        if (postSave) this.schema.post('save', postSave);
        if (preUpdate) this.schema.pre(['updateOne', 'findOneAndUpdate'], preUpdate);
        if (postUpdate) this.schema.post(['updateOne', 'findOneAndUpdate'], postUpdate);
        if (preDelete) this.schema.pre(['deleteOne', 'deleteMany'], preDelete);
        if (postDelete) this.schema.post(['deleteOne', 'deleteMany'], postDelete);
    }

    /**
     * Represents MongoDB schema object.
     * @static
     * @type {mongoose.Schema}
     */
    static mongoSchema = mongoose.Schema;
}

module.exports = SchemaDB;
