const source = require('.');
const ErrorLog = require('../models/logs/ErrorLog');

class Resources {
    constructor(language) {
        this.base = source[language];
    }

    text(path, ...params) {
        const current = this.getPath('texts.' + path);
        return Boolean.isValid(current).function().eval() && current(...params);
    }

    templates(path, ...params) {
        if (!path) {
            return () => '';
        }

        if (typeof path === 'object') {
            return path.renderToString;
        }

        const current = this.getPath('templates.' + path);

        if (Boolean.isValid(current).function().eval()) {
            return current(...params);
        }
    }

    error(path, ...params) {
        try {
            const current = this.getPath('errors.' + path);
            return Boolean.isValid(current).function().eval() && current(...params);
        } catch(err) {
            return new Error.Log(err).consolePrint();
        }
    }
    
    getPath(pathString) {
        const parsedPath = Boolean.isValid(pathString).filled().string().eval() && pathString.split('.');
        let result = this.base;

        for (let path of parsedPath) {
            if (!result[path]) throw new ErrorLog(this.error('resources.path_string_not_found', pathString));
            result = result[path];
        }

        return Boolean.isValid(result).function().eval() && result;
    }
}

module.exports = Resources;
