const { createClient } = require('redis');
const crypto = require('crypto');
const { buildKey, parseDocToSave, parseDocToRead } = require('./RedisHelpers');
const RedisEventEmitters = require('./RedisEventEmitters');

class RedisService {
    constructor(setup, apiServer) {
        const { clientOptions, onConnect, onReady, onEnd, onError, onReconnecting } = Object(setup);

        try {
            this.apiServer = apiServer;
            this.client = createClient(clientOptions);
            
            this.addListener('connect', onConnect);
            this.addListener('ready', onReady);
            this.addListener('end', onEnd);
            this.addListener('error', onError);
            this.addListener('reconnecting', onReconnecting);
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async connect() {
        try {
            this.connection = await this.client.connect();
            return this;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async disconnect() {
        try {
            delete this.connection;
            return await this.client.disconnect();
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    addListener(evName, callback) {
        if (typeof callback === 'function') {
            this.client.on(evName, callback);
        }
    }

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
            throw new Error.Log(err);
        }
    }

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
            throw new Error.Log(err);
        }
    }

    async setDoc(setup) {
        const { prefixName, uid, data } = Object(setup);
        let { collection } = Object(setup)
        const setters = [];

        try {
            if (collection && typeof collection !== 'string') {
                throw new Error.Log('commom.bad_format_param', 'collection', 'RedisService.setDoc', 'string', collection);
            }

            if (!uid || typeof uid !== 'string') {
                throw new Error.Log('commom.bad_format_param', 'uid', 'RedisService.setDoc', 'string', uid);
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
            throw new Error.Log(err);
        }
    }
    
    async getDoc(setup) {
        const { collection, uid } = Object(setup);

        try {
            await new Promise((resolve, reject) => {
                setup.collectionSet = this.apiServer.getCollectionSet(collection);
                RedisEventEmitters.preRead.call(setup, resolve, reject);
            });

            const doc = await this.client.hGetAll(buildKey(collection, uid));

            if (!Object.keys(doc).length) {
                return;
            }

            RedisEventEmitters.postRead.call(setup);
            return parseDocToRead(this.apiServer.getCollectionSet(collection), doc);
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async setDocField(setup) {
        const { collection, uid, field } = Object(setup);
        let { value } = Object(setup);

        try {
            if (!collection || typeof collection !== 'string') {
                throw new Error.Log('commom.bad_format_param', 'collection', 'RedisService.setDocField', 'string', collection);
            }

            if (!uid || typeof uid !== 'string') {
                throw new Error.Log('commom.bad_format_param', 'uid', 'RedisService.setDocField', 'string', uid);
            }

            if (!field || typeof field !== 'string') {
                throw new Error.Log('commom.bad_format_param', 'field', 'RedisService.setDocField', 'string', uid);
            }

            if (!value) {
                return;
            }

            const ready = await this.client.hSet(buildKey(collection, uid), field, value);
            return { success: true, status: ready };
        } catch (err) {
            throw new Error.Log(err);
        }
    }

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
            throw new Error.Log(err);
        }
    }
}

module.exports = RedisService;
