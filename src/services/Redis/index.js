const { createClient } = require('redis');
const crypto = require('crypto');

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

    async createDoc(setup) {
        let { collection, uid, data } = Object(setup);
        const setters = [];

        if (!uid) {
            uid = crypto.randomBytes(10).toString('hex');
        }

        try {
            Object.keys(data).map(key => {
                setters.push(this.setDocField(`${collection}:${uid}`, key, data[key]));
            });

            const saved = await Promise.all(setters);

            if (saved.every(item => item.success)) {
                return { success: true };
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }
    
    async getDoc({ collection, uid }) {
        try {
            const doc = await this.client.hGetAll(`${collection}:${uid}`);
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
