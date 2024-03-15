class RedisEventEmitters {
    static preCreate(next, reject) {
        const collectionEvent = this.collectionSet?.redisEvents?.preCreate;

        if (typeof collectionEvent === 'function') {
            process.emit(`redis:precreate:${this.collection}`, this, next, reject);
        } else {
            next();
        }
    }

    static postCreate() {
        process.emit(`redis:postcreate:${this.collection}`, this);
    }

    static preRead(next, reject) {
        const collectionEvent = this.collectionSet?.redisEvents?.preRead;

        if (typeof collectionEvent === 'function') {
            process.emit(`redis:preread:${this.collection}`, this, next, reject);
        } else {
            next();
        }
    }

    static postRead() {
        process.emit(`redis:postread:${this.collection}`, this);
    }

    static preUpdate(next, reject) {
        const collectionEvent = this.collectionSet?.redisEvents?.preUpdate;

        if (typeof collectionEvent === 'function') {
            process.emit(`redis:preupdate:${this.collection}`, this, next, reject);
        } else {
            next();
        }
    }

    static postUpdate() {
        process.emit(`redis:postupdate:${this.collection}`, this);
    }

    static preDelete(next, reject) {
        const collectionEvent = this.collectionSet?.redisEvents?.preUpdate;

        if (typeof collectionEvent === 'function') {
            process.emit(`redis:predelete:${this.collection}`, this, next, reject);
        } else {
            next();
        }
    }

    static postDelete() {
        process.emit(`redis:postdelete:${this.collection}`, this);
    }
}

module.exports = RedisEventEmitters;
