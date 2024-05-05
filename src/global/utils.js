/**
 * Retrieves a value from a nested object based on the specified object path.
 * @param {Object} obj - The object to extract the value from.
 * @param {string|Array} path - The path to the desired property. Can be a string with dot notation or an array of keys.
 * @returns {*} - The value at the specified object path or undefined if the path does not exist.
 * @throws {Error} - Throws an error if there is an issue accessing the object path.
 */
function getObjectPath(obj, path) {
    try {
        let parsedPath = path;

        if (typeof path === 'string') {
            parsedPath = path.split('.');
        }

        if (Array.isArray(parsedPath)) {
            parsedPath.map(key => (obj = obj && obj[key]));
        } else {
            return;
        }

        return obj;
    } catch (err) {
        throw logError(err);
    }
}

/**
 * Converts a numeric value from a specific time unit to milliseconds.
 * @param {number} value - The numeric value to be converted.
 * @param {string} unit - The time unit of the input value (minute, hour, day, week, month, year).
 * @returns {number} - The converted value in milliseconds.
 * @throws {Error} - Throws an error if the input value or unit is invalid.
 */
function convertToMillis(value, unit) {
    if (typeof value !== 'number' && !isNaN(value)) {
        throw logError('common.bad_format_param', 'value', 'convertToMillis', 'number', unit, 'utils.js');
    }

    if (typeof unit !== 'string') {
        throw logError('common.bad_format_param', 'unit', 'convertToMillis', 'string', unit, 'utils.js');
    }

    switch (unit.toUpperCase()) {
        case 'MINUTE': {
            return value * 60 * 1000;
        }
        case 'HOUR': {
            return value * 60 * 60 * 1000;
        }
        case 'DAY': {
            return value * 24 * 60 * 60 * 1000;
        }
        case 'WEEK': {
            return value * 7 * 24 * 60 * 60 * 1000;
        }
        case 'MONTH': {
            return value * 4 * 7 * 24 * 60 * 60 * 1000;
        }
        case 'YEAR': {
            return value * 12 * 4 * 7 * 24 * 60 * 60 * 1000;
        }
        default: {
            throw logError('common.bad_format_param', 'unit', 'convertToMillis', 'minute || hour || day || week || month || year', unit, 'utils.js');
        }
    }
}

/**
 * Converts a numeric value from milliseconds to a specific time unit.
 * @param {number} value - The numeric value to be converted (in milliseconds).
 * @param {string} unit - The desired time unit of the output value (minute, hour, day, week, month, year).
 * @returns {number} - The converted value in the specified time unit.
 * @throws {Error} - Throws an error if the input value or unit is invalid.
 */
function convertMillisTo(value, unit) {
    if (!value) return;
    if (typeof value !== 'number' && !isNaN(value)) {
        throw logError('common.bad_format_param', 'value', 'convertToMillis', 'number', unit, 'utils.js');
    }

    if (typeof unit !== 'string') {
        throw logError('common.bad_format_param', 'unit', 'convertToMillis', 'string', unit, 'utils.js');
    }

    switch (unit.toUpperCase()) {
        case 'MINUTE': {
            return value / 1000 / 60;
        }
        case 'HOUR': {
            return value / 1000 / 60 / 60;
        }
        case 'DAY': {
            return value / 1000 / 60 / 60 / 24;
        }
        case 'WEEK': {
            return value / 1000 / 60 / 60 / 24 / 7;
        }
        case 'MONTH': {
            return value / 1000 / 60 / 60 / 24 / 7 / 4;
        }
        case 'YEAR': {
            return value / 1000 / 60 / 60 / 24 / 7 / 4 / 12;
        }
        default: {
            throw logError('common.bad_format_param', 'unit', 'convertToMillis', 'minute || hour || day || week || month || year', unit, 'utils.js');
        }
    }
}

module.exports = {
    getObjectPath,
    convertToMillis,
    convertMillisTo
};
