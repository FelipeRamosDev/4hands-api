const { createClient } = require('redis');

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
            return await this.client.connect();
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async disconnect() {
        try {
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

    async createDoc(collection, uid, data) {
        const setters = [];

        try {
            for (const key of Object.keys(data)) {
                setters.push(this.setDocField(`${collection}:${uid}`, key, data[key]));
            }

            return await Promise.all(setters);
        } catch (err) {
            throw new Error.Log(err);
        }
    }
    
    async getDoc(uid) {
        try {
            const doc = await this.client.hGetAll(uid);
            return doc;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async setDocField(uid, field, value) {
        try {
            const ready = await this.client.hSet(uid, field, value);
            return { success: true, status: ready };
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = RedisService;
