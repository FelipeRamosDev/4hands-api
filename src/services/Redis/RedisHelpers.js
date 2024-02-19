const Collection = require('4hands-api/src/models/settings/Collection');

class RedisHelpers {
    static buildKey(collection, uid) {
        return `${collection}:${uid}`;
    }

    static parseDocToSave(collectionSet, value) {
        const result = {};

        if (collectionSet instanceof Collection && typeof value === 'object' && !Array.isArray(value)) {
            Object.keys(collectionSet?.schema?.obj).map(key => {
                const item = collectionSet.schema.obj[key];
                const { type } = Object(item);
                const { parseString, parseNum, parseDateToSave, parseArrayToSave, parseObjectToSave, parseDefault } = RedisHelpers;
    
                if (type?.name === 'String') {
                    result[key] = parseString(value[key]) || parseDefault(item.default);
                }

                else if (type?.name === 'Number') {
                    result[key] = parseNum(value[key]) || parseDefault(item.default);
                }

                else if (type?.name === 'Date') {
                    result[key] = parseDateToSave(value[key]) || parseDefault(item.default);
                }

                else if (Array.isArray(type)) {
                    result[key] = parseArrayToSave(value[key]) || parseDefault(item.default);
                }

                else if (typeof type === 'object' && !Array.isArray(type)) {
                    result[key] = parseObjectToSave(value[key]) || parseDefault(item.default);
                }
            });

            return result;
        } else {
            return value;
        }
    }

    static parseDocToRead(collectionSet, value) {
        const result = {};

        if (collectionSet instanceof Collection && typeof value === 'object' && !Array.isArray(value)) {
            Object.keys(collectionSet?.schema?.obj).map(key => {
                const item = collectionSet.schema.obj[key];
                const { type } = Object(item);
                const { parseString, parseNum, parseDateToRead, parseArrayToRead, parseObjectToRead, parseDefault } = RedisHelpers;
    
                if (type?.name === 'String') {
                    result[key] = parseString(value[key]) || parseDefault(item.default);
                }

                else if (type?.name === 'Number') {
                    result[key] = parseNum(value[key]) || parseDefault(item.default);
                }

                else if (type?.name === 'Date') {
                    result[key] = parseDateToRead(value[key]) || parseDefault(item.default);
                }

                else if (Array.isArray(type)) {
                    result[key] = parseArrayToRead(value[key]) || parseDefault(item.default);
                }

                else if (typeof type === 'object' && !Array.isArray(type)) {
                    result[key] = parseObjectToRead(value[key]) || parseDefault(item.default);
                }
            });

            return result;
        } else {
            return value;
        }
    }

    static parseString(value) {
        if (value === undefined || value === null || value === NaN) {
            value = '';
        }

        if (typeof value === 'object') {
            return new Error.Log('common.bad_format_param', 'value', 'RedisHelpers.parseString', 'string', 'object/array');
        }

        return String(value);
    }

    static parseNum(value) {
        if (!value) {
            return;
        }

        if (isNaN(value)) {
            return new Error.Log('common.bad_format_param', 'value', 'RedisHelpers.parseString', 'number', 'NaN');
        }

        return Number(value);
    }

    static parseDateToSave(value) {
        if (!value) {
            return;
        }

        try {
            const parsedObj = new Date(value);
            return parsedObj.toJSON();
        } catch (err) {
            return;
        }
    }

    static parseDateToRead(value) {
        if (!value) {
            return;
        }

        try {
            const parsedObj = new Date(value);
            return parsedObj.getTime();
        } catch (err) {
            return;
        }
    }

    static parseArrayToSave(value) {
        if (!value) {
            return;
        }

        try {
            return JSON.stringify(value);
        } catch (err) {
            return;
        }
    }

    static parseArrayToRead(value) {
        if (!value) {
            return;
        }

        try {
            return JSON.parse(value);
        } catch (err) {
            return;
        }
    }

    static parseObjectToSave(value) {
        if (!value) {
            return;
        }

        try {
            return JSON.stringify(value);
        } catch (err) {
            return;
        }
    }

    static parseObjectToRead(value) {
        if (!value) {
            return;
        }

        try {
            return JSON.parse(value);
        } catch (err) {
            return;
        }
    }

    static parseDefault(defaultValue) {
        if (typeof defaultValue === 'function'){
            return defaultValue();
        } else {
            return defaultValue;
        }
    }
}

module.exports = RedisHelpers;
