const mongoose = require('mongoose');
const {getGlobalSchema} = require('../schemas/_globals');
const schemasClass = require('../schemas/class');
const RefConfig = require('./settings/SchemaRefConfig');
const {database: {dbHelpers, queries, events}} = require('../helpers');
const configs = require('@config');
const GlobalClass = schemasClass.GlobalClass;
const customQueries = require('@schemas/queries');
const customEvents = require('@schemas/events');

class SchemaDB {
    static RefConfig = RefConfig;

    constructor(setup = {
        name: String(),
        symbol: String(),
        schema: mongoose.SchemaTypeOptions.prototype,
        excludeGlobals: [],
        links: Object(),
        queries: Object(),
        events: Object()
    }) {
        try {
            this.name = setup.name;
            this.symbol = setup.symbol;

            if (Array.isArray(setup.fieldsSet)) {
                if (!setup.schema) setup.schema = {};
                this.fieldsSet = setup.fieldsSet;

                setup.fieldsSet.map(item => {
                    setup.schema[item.fieldName] = item;
                });
            }

            this.schema = new mongoose.Schema({...getGlobalSchema(setup.excludeGlobals), ...setup.schema});
            this.queries = setup.queries || Object(customQueries[this.name]);
            this.events = setup.events || Object(customEvents[this.name]);
            this.DB = null;

            // Initializing queries, events and classes
            this.initQueries();
            this.initEvents();
            this.initClasses();

            // Initializing the collection
            this.init();
            const date = new Date();

            if (configs.database.consoleLogs.collectionLoaded) {
                console.log(`[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] Collection "${this.name}" was successful initialized!`)
            }
        } catch(err) {
            throw new Error.Log(err);
        }
    }

    init() {
        try {
            if (!global.initializedCollections) global.initializedCollections = [];
            if (this.name !== configs.database.counterCollection) dbHelpers.createCounter(this);

            const isDup = mongoose.modelNames().find(key => key === this.name);
            const isDupSymbol = initializedCollections.find(key => key === this.symbol);

            if (!isDup && !isDupSymbol) {
                initializedCollections.push(this.symbol);
                this.DB = mongoose.model(this.name, this.schema);
            } else {
                const error = new Error.Log('database.duplicated_schema', this.name, this.symbol);
                if (isDup) error.append('database.duplicated_schema_name', this.name);
                if (isDupSymbol) error.append('database.duplicated_schema_symbol', this.symbol);
                throw error;
            }
        } catch(err) {
            throw new Error.Log(err).append('database.schema_init');
        } 
    }

    initQueries() {
        try {
            // Adding global and custom queries
            this.schema.query = {...this.schema.query, ...queries, ...this.queries};
        } catch(err) {
            throw new Error.Log(err).append('database.init_queries');
        }
    }

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

    initClasses() {
        try {
            // Loading global class
            this.schema.loadClass(GlobalClass);

            // Loading the schema custom classe
            const Custom = schemasClass[this.name];
            if (Custom) this.schema.loadClass(Custom);

            this.schema.set('toObject', {virtuals: true});
        } catch(err) {
            throw new Error.Log(err).append('database.init_classes');
        }
    }

    static mongoSchema = mongoose.Schema;
}

module.exports = SchemaDB;
