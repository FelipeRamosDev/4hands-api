const source = require('.');
const ErrorLog = require('../models/logs/ErrorLog');
const FS = require('4hands-api/src/services/FS');
const path = require('path');

/**
 * Class representing a resource manager for handling language-specific resources.
 */
class Resources {
    /**
     * Creates an instance of Resources.
     * @constructor
     * @param {string} [language='en_US'] - The language code for the desired language. Defaults to 'en_US'.
     */
    constructor(language) {
        this.projectPath = path.normalize(__dirname.replace(path.normalize('/node_modules/4hands-api/src/models'), '/'));
        this.language = language || 'en_US';
        this.base = source[this.language];

        const resourcePath = path.normalize(this.projectPath + 'src/resources/' + this.language);
        if (FS.isExist(resourcePath)) {
            this.loadResources(require(resourcePath));
        }
    }

    /**
     * Retrieves a text resource at the specified path.
     * @param {string} path - The path to the text resource.
     * @param {...any} params - Additional parameters for the text resource function.
     * @returns {string|undefined} The text resource or undefined if the path is not found.
     */
    text(path, ...params) {
        const current = this.getPath('texts.' + path);
        return Boolean.isValid(current).function().eval() && current(...params);
    }

    /**
     * Retrieves a template resource at the specified path.
     * @param {string|object} path - The path to the template resource or a template object.
     * @param {...any} params - Additional parameters for the template resource function.
     * @returns {string|Function} The template resource or a rendering function if the path is found.
     */
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

    /**
     * Retrieves an error resource at the specified path.
     * @param {string} path - The path to the error resource.
     * @param {...any} params - Additional parameters for the error resource function.
     * @returns {string|undefined} The error resource or undefined if the path is not found.
     */
    error(path, ...params) {
        try {
            const current = this.getPath('errors.' + path);
            return Boolean.isValid(current).function().eval() && current(...params);
        } catch(err) {
            return new Error.Log(err).consolePrint();
        }
    }

    /**
     * Retrieves a resource at the specified path.
     * @param {string} pathString - The path to the desired resource.
     * @returns {Function|undefined} The resource function or undefined if the path is not found.
     * @throws {ErrorLog} If the specified path is not found in the resource data.
     */
    getPath(pathString) {
        const parsedPath = Boolean.isValid(pathString).filled().string().eval() && pathString.split('.');
        let result = this.base;

        for (let path of parsedPath) {
            if (!result[path]) throw new ErrorLog(this.error('resources.path_string_not_found', pathString));
            result = result[path];
        }

        return Boolean.isValid(result).function().eval() && result;
    }

    /**
     * Loads additional resources into the resource manager.
     * @param {Object} resources - The additional resources to be loaded.
     * @throws {Error} If an error occurs while loading the resources.
     */
    loadResources(resources) {
        try {
            this.base = {...this.base, ...resources};
        } catch (err) {
            throw err;
        }
    }
}

module.exports = Resources;
