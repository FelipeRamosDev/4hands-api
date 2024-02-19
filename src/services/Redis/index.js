const { createClient } = require('redis');
const crypto = require('crypto');
const { buildKey, parseDocToSave, parseDocToRead } = require('./RedisHelpers');

class RedisService {
    constructor(setup) {
        const { clientCB, clientOptions } = Object(setup);
        const { connect, ready, end, error, reconnecting } = Object(clientCB);

        try {
            this.client = createClient(clientOptions);
            
            this.addListener('connect', connect);
            this.addListener('ready', ready);
            this.addListener('end', end);
            this.addListener('error', error);
            this.addListener('reconnecting', reconnecting);
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
            return await this.setDoc({ collection, uid, data });
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async setDoc(setup) {
        const { collection, uid, data } = Object(setup);
        const setters = [];

        try {
            if (!collection || typeof collection !== 'string') {
                throw new Error.Log('commom.bad_format_param', 'collection', 'RedisService.setDoc', 'string', collection);
            }

            if (!uid || typeof uid !== 'string') {
                throw new Error.Log('commom.bad_format_param', 'uid', 'RedisService.setDoc', 'string', uid);
            }

            if (!data || typeof data !== 'object' || Array.isArray(data)) {
                return;
            }

            const parsedValue = parseDocToSave(API.getCollectionSet(collection), data);
            Object.keys(parsedValue).map(key => {
                setters.push(this.setDocField({collection, uid, field: key, value: parsedValue[key]}));
            });

            await Promise.all(setters);
            return { success: true };
        } catch (err) {
            throw new Error.Log(err);
        }
    }
    
    async getDoc({ collection, uid }) {
        try {
            const doc = await this.client.hGetAll(buildKey(collection, uid));
            return parseDocToRead(API.getCollectionSet(collection), doc);
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async setDocField(setup) {
        const { collection, uid, field, value } = Object(setup);

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

            keys.map(curr => promises.push(this.client.hDel(key, curr)));

            const resolve = await Promise.all(promises);
            if (resolve.every(success => success)) {
                return { success: true };
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = RedisService;
