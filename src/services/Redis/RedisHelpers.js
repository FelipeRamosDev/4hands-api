const Collection = require('4hands-api/src/models/settings/Collection');

class RedisHelpers {
    static buildKey(collection, uid) {
        return `${collection}:${uid}`;
    }

    static parseDocToSave(collectionSet, value) {
        const result = {};

        if (collectionSet instanceof Collection && typeof value === 'object' && !Array.isArray(value)) {
            Object.keys(value).map(key => {
                const item = collectionSet.schema.tree[key];
                if (!item) {
                    return;
                }

                const { type } = Object(item);
                const { parseString, parseNum, parseDateToSave, parseArrayToSave, parseObjectToSave, parseDefault, parseObjectId } = RedisHelpers;
                const parsedDefault = parseDefault(item.default);

                if (type === 'ObjectId' || type?.name === 'ObjectId') {
                    result[key] = parseObjectId(value[key], true) || parsedDefault;
                }

                if (type?.name === 'String') {
                    result[key] = parseString(value[key]) || parsedDefault;
                }

                else if (type?.name === 'Number') {
                    result[key] = parseNum(value[key]) || parsedDefault;
                }

                else if (type?.name === 'Date') {
                    result[key] = parseDateToSave(value[key]) || parsedDefault;
                }

                else if (Array.isArray(type)) {
                    result[key] = parseArrayToSave(value[key]) || parsedDefault;
                }

                else if (typeof type === 'object' && !Array.isArray(type)) {
                    result[key] = parseObjectToSave(value[key]) || parsedDefault;
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
            Object.keys(collectionSet?.schema?.tree).map(key => {
                const item = collectionSet.schema.tree[key];
                const { type } = Object(item);
                const { parseString, parseNum, parseDateToRead, parseArrayToRead, parseObjectToRead, parseDefault, parseObjectId, isValidJSON } = RedisHelpers;
                const parsedDefault = parseDefault(item.default);

                if (type === 'ObjectId' || type?.name === 'ObjectId') {
                    result[key] = parseObjectId(value[key]) || parsedDefault;
                }

                else if (type?.name === 'String') {
                    if (isValidJSON(value[key])) {
                        result[key] = JSON.parse(value[key]);
                    } else {
                        result[key] = parseString(value[key]) || parsedDefault;
                    }
                }

                else if (type?.name === 'Number') {
                    result[key] = parseNum(value[key]) || parsedDefault;
                }

                else if (type?.name === 'Date') {
                    result[key] = parseDateToRead(value[key]) || parsedDefault;
                }

                else if (Array.isArray(type)) {
                    result[key] = parseArrayToRead(value[key]) || parsedDefault;
                }

                else if (typeof type === 'object' && !Array.isArray(type)) {
                    result[key] = parseObjectToRead(value[key]) || parsedDefault;
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

    static parseObjectId(value, toSave) {
        if (!value) {
            return;
        }

        if (value.isComplete || value.isConstructed) {
            return toSave ? JSON.stringify(value) : JSON.parse(value);
        }

        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch (err) {
                return value;
            }
        }

        return value.toString && toSave ? value.toString() : value;
    }

    static isValidJSON(value) {
        if (typeof value === 'string') {
            try {
                JSON.parse(value);
                return true;
            } catch (err) {
                return false;
            }
        }
    }
}

module.exports = RedisHelpers;
