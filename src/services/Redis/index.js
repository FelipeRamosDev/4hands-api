const { createClient } = require('redis');
const crypto = require('crypto');
const { buildKey, parseDocToSave, parseDocToRead } = require('./RedisHelpers');
const RedisEventEmitters = require('./RedisEventEmitters');

/**
 * A class representing a Redis service for handling data operations.
 */
class RedisService {
    /**
     * Creates an instance of RedisService.
     * 
     * @constructor
     * @param {Object} setup - Configuration options for the Redis service.
     * @param {Object} apiServer - An API server object.
     */
    constructor(setup, apiServer) {
        const { clientOptions, onConnect, onReady, onEnd, onError, onReconnecting } = Object(setup);

        try {
            this._apiServer = () => apiServer;
            this.client = createClient(clientOptions);
            
            this.addListener('connect', onConnect);
            this.addListener('ready', onReady);
            this.addListener('end', onEnd);
            this.addListener('error', onError);
            this.addListener('reconnecting', onReconnecting);
        } catch (err) {
            throw logError(err);
        }
    }

    get apiServer() {
        return this._apiServer();
    }

    /**
     * Asynchronously connects to the Redis server.
     * 
     * @async
     * @function connect
     * @returns {Promise<Object>} A promise that resolves to the RedisService instance.
     * @throws {Error} Will throw an error if connection fails.
     */
    async connect() {
        try {
            await this.client.connect();
            return this;
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Asynchronously disconnects from the Redis server.
     * 
     * @async
     * @function disconnect
     * @returns {Promise<any>} A promise that resolves when disconnection is successful.
     * @throws {Error} Will throw an error if disconnection fails.
     */
    async disconnect() {
        try {
            delete this.connection;
            return await this.client.disconnect();
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Adds an event listener to the Redis client.
     * 
     * @function addListener
     * @param {string} evName - The name of the event to listen for.
     * @param {Function} callback - The callback function to execute when the event occurs.
     */
    addListener(evName, callback) {
        if (typeof callback === 'function') {
            this.client.on(evName, callback);
        }
    }

    /**
     * Asynchronously sets an item in the Redis client with a unique identifier.
     * 
     * @async
     * @function setItem
     * @param {Object} params - An object containing the parameters.
     * @param {string} params.uid - The unique identifier for the item. If not provided, a new uid will be generated.
     * @param {any} params.value - The value to be set for the item.
     * @param {string} params.prefix - The prefix to be used when building the key.
     * @returns {Promise<Object>} A promise that resolves to an object with a success property.
     * @throws {Error} Will throw an error if setting the item fails.
     */
    async setItem(params) {
        const { uid, value, prefix } = Object(params);

        try {
            if (typeof uid !== 'string') {
                uid = crypto.randomBytes(10).toString('hex');
            }

            const keyName = buildKey(prefix, uid);
            let parsedValue = value;

            if (typeof value === 'object') {
                parsedValue = JSON.stringify(parsedValue);
            }

            await this.client.set(keyName, parsedValue);
            return { success: true, keyName, value };
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Asynchronously retrieves an item from the Redis client.
     * 
     * @async
     * @function getItem
     * @param {Object} params - An object containing the parameters.
     * @param {string} params.key - The key of the item to retrieve.
     * @param {string} params.prefix - The prefix used when building the key.
     * @returns {Promise<any>} A promise that resolves to the retrieved item.
     * @throws {Error} Will throw an error if retrieval fails.
     */
    async getItem(params) {
        const { key, prefix } = Object(params);

        try {
            if (typeof key !== 'string') {
                return;
            }

            const keyName = buildKey(prefix, key);
            const value = await this.client.get(keyName);

            if (!isNaN(value)) {
                return Number(value);
            }
            
            try {
                const parsed = JSON.parse(value);
                return parsed;
            } catch (error) {
                return value;
            }
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Asynchronously deletes an item.
     * 
     * @param {Object} params - The parameters for the item to be deleted.
     * @param {string} params.key - The key of the item.
     * @param {string} params.prefix - The prefix of the key.
     * 
     * @returns {Promise} A promise that resolves when the item is deleted.
     * 
     * @throws {Error} If an error occurs during deletion.
     */
    async deleteItem(params) {
        try {
            const { key, prefix } = Object(params);

            if (typeof key !== 'string') {
                return;
            }

            const keyName = buildKey(prefix, key);
            return await this.client.del(keyName);
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Asynchronously creates a document in the Redis client.
     * 
     * @async
     * @function createDoc
     * @param {Object} setup - Configuration options for creating the document.
     * @returns {Promise<Object>} A promise that resolves to an object with a success property.
     * @throws {Error} Will throw an error if document creation fails.
     */
    async createDoc(setup) {
        let { collection, uid, data } = Object(setup);

        if (!uid) {
            uid = crypto.randomBytes(10).toString('hex');
        }

        try {
            await new Promise((resolve, reject) => {
                setup.collectionSet = this.apiServer.getCollectionSet(collection);
                RedisEventEmitters.preCreate.call(setup, resolve, reject);
            });

            const created = await this.setDoc({ collection, uid, data });
            RedisEventEmitters.postCreate.call(setup);
            return created;
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Asynchronously updates a document in the Redis client.
     * 
     * @async
     * @function updateDoc
     * @param {Object} setup - Configuration options for updating the document.
     * @returns {Promise<Object>} A promise that resolves to an object with a success property.
     * @throws {Error} Will throw an error if document update fails.
     */
    async updateDoc(setup) {
        const { collection, uid, data } = Object(setup);

        try {
            await new Promise((resolve, reject) => {
                setup.collectionSet = this.apiServer.getCollectionSet(collection);
                RedisEventEmitters.preUpdate.call(setup, resolve, reject);
            });

            const updated = await this.setDoc({ collection, uid, data });
            RedisEventEmitters.postUpdate.call(setup);
            return updated;
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Asynchronously sets a document in the Redis client.
     * 
     * @async
     * @function setDoc
     * @param {Object} setup - Configuration options for setting the document.
     * @returns {Promise<Object>} A promise that resolves to an object with a success property.
     * @throws {Error} Will throw an error if setting the document fails.
     */
    async setDoc(setup) {
        const { prefixName, uid, data } = Object(setup);
        let { collection } = Object(setup)
        const setters = [];

        try {
            if (collection && typeof collection !== 'string') {
                throw logError('commom.bad_format_param', 'collection', 'RedisService.setDoc', 'string', collection);
            }

            if (!uid || typeof uid !== 'string') {
                throw logError('commom.bad_format_param', 'uid', 'RedisService.setDoc', 'string', uid);
            }

            if (!data || typeof data !== 'object' || Array.isArray(data)) {
                return;
            }

            let parsedValue;
            if (!collection) {
                collection = prefixName || '';
                parsedValue = parseDocToSave(null, data);
            } else {
                parsedValue = parseDocToSave(this.apiServer.getCollectionSet(collection), data);
            }

            Object.keys(parsedValue).map(key => {
                setters.push(this.setDocField({collection, uid, field: key, value: parsedValue[key]}));
            });

            await Promise.all(setters);
            return { success: true };
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Asynchronously retrieves a document from the Redis client.
     * 
     * @async
     * @function getDoc
     * @param {Object} setup - Configuration options for retrieving the document.
     * @returns {Promise<any>} A promise that resolves to the retrieved document.
     * @throws {Error} Will throw an error if retrieval fails.
     */
    async getDoc(setup) {
        const { prefixName, collection, uid } = Object(setup);

        try {
            await new Promise((resolve, reject) => {
                setup.collectionSet = this.apiServer.getCollectionSet(collection);
                RedisEventEmitters.preRead.call(setup, resolve, reject);
            });

            const doc = await this.client.hGetAll(buildKey(collection || prefixName, uid));

            if (!Object.keys(doc).length) {
                return;
            }

            RedisEventEmitters.postRead.call(setup);
            return parseDocToRead(this.apiServer.getCollectionSet(collection), doc);
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Asynchronously sets a field in a document in the Redis client.
     * 
     * @async
     * @function setDocField
     * @param {Object} setup - Configuration options for setting the field.
     * @returns {Promise<Object>} A promise that resolves to an object with a success property.
     * @throws {Error} Will throw an error if setting the field fails.
     */
    async setDocField(setup) {
        const { collection, uid, field } = Object(setup);
        let { value } = Object(setup);

        try {
            if (collection && typeof collection !== 'string') {
                throw logError('commom.bad_format_param', 'collection', 'RedisService.setDocField', 'string', collection);
            }

            if (!uid || typeof uid !== 'string') {
                throw logError('commom.bad_format_param', 'uid', 'RedisService.setDocField', 'string', uid);
            }

            if (!field || typeof field !== 'string') {
                throw logError('commom.bad_format_param', 'field', 'RedisService.setDocField', 'string', uid);
            }

            if (!value) {
                return;
            }

            const ready = await this.client.hSet(buildKey(collection, uid), field, value);
            return { success: true, status: ready };
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Asynchronously deletes a document from the Redis client.
     * 
     * @async
     * @function deleteDoc
     * @param {Object} setup - Configuration options for deleting the document.
     * @returns {Promise<Object>} A promise that resolves to an object with a success property.
     * @throws {Error} Will throw an error if deletion fails.
     */
    async deleteDoc(setup) {
        const { collection, uid } = Object(setup);
        const key = buildKey(collection, uid);
        const promises = [];

        try {
            const keys = await this.client.hKeys(key);
            await new Promise((resolve, reject) => {
                setup.collectionSet = this.apiServer.getCollectionSet(collection);
                RedisEventEmitters.preDelete.call(setup, resolve, reject);
            });

            keys.map(curr => promises.push(this.client.hDel(key, curr)));

            const resolve = await Promise.all(promises);
            RedisEventEmitters.postDelete.call(setup);
            if (resolve.every(success => success)) {
                return { success: true };
            }
        } catch (err) {
            throw logError(err);
        }
    }
}

module.exports = RedisService;
