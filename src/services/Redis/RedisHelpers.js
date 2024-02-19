class RedisHelpers {
    static buildKey(collection, uid) {
        return `${collection}:${uid}`;
    }
}

module.exports = RedisHelpers;
