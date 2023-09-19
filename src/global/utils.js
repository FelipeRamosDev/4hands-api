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
        throw new Error.Log(err);
    }
}

function convertToMillis(value, unit) {
    if (typeof value !== 'number' && !isNaN(value)) {
        throw new Error.Log('common.bad_format_param', 'value', 'convertToMillis', 'number', unit, 'utils.js');
    }

    if (typeof unit !== 'string') {
        throw new Error.Log('common.bad_format_param', 'unit', 'convertToMillis', 'string', unit, 'utils.js');
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
            throw new Error.Log('common.bad_format_param', 'unit', 'convertToMillis', 'minute || hour || day || week || month || year', unit, 'utils.js');
        }
    }
}

function convertMillisTo(value, unit) {
    if (!value) return;
    if (typeof value !== 'number' && !isNaN(value)) {
        throw new Error.Log('common.bad_format_param', 'value', 'convertToMillis', 'number', unit, 'utils.js');
    }

    if (typeof unit !== 'string') {
        throw new Error.Log('common.bad_format_param', 'unit', 'convertToMillis', 'string', unit, 'utils.js');
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
            throw new Error.Log('common.bad_format_param', 'unit', 'convertToMillis', 'minute || hour || day || week || month || year', unit, 'utils.js');
        }
    }
}

module.exports = {
    getObjectPath,
    convertToMillis,
    convertMillisTo
};
