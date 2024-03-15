const ajax = require('./ajax');
const Resource = require('../resources/Resources');
const validation = require('../validation');
const ErrorLog = require('../models/logs/ErrorLog');
const configs = require('4hands-api/configs/project');
const ToolsCLI = require('../interface/CLI/ToolsCLI');
const toolsCLI = new ToolsCLI();
const Success = require('4hands-api/src/models/Success');
const utils = require('4hands-api/src/global/utils');

/**
 * @global
 * @name ajax - Does AJAX requests
 */
global.ajax = ajax;

/**
 * @global
 * @name Resource - Resource instance to call text and other resources.
 */
global.Resource = new Resource(configs.defaultLanguage);

/**
 * @global
 * @name toolsCLI - CLI tools to use in everywhere.
 */
global.toolsCLI = toolsCLI;

/**
 * @global
 * @name Error.Log - To log errors and any other log.
 */
global.Error.Log = ErrorLog;
// Utils
Boolean.isValid = validation.base.build;

/**
 * @method oid
 * @description Method that evaluate if the provided object on "Object(objectToEval)" is a mongoose ObjectID or not. 
 * @returns {boolean}
 */
Object.prototype.oid = function(toValue) {
    const isValid = validation.base.ValidationBase.isObjectID(this);

    if (toValue) {
        return isValid ? this.valueOf() : {};
    } else {
        return isValid;
    }
}

Object.prototype.toSuccess = function(message) {
    return new Success(this.valueOf(), message);
}

/**
 * @method prototype.getPath
 * 
 * @description Method that that safely gets the values of an object property without throw errors bay an undefined path.
 * @param {string|array<string>} path - Can be a string path for the object property with each property separated by a ".", or can be an array of string where each string is a path.
 * @returns {*} - Anything that can be stored on the provided path
 */
Object.prototype.getSafe = function(path, obj) {
    return utils.getObjectPath(obj || this, path);
}

Date.convertToMillis = utils.convertToMillis;
Date.convertMillisTo = utils.convertMillisTo;

String.prototype.toCamelCase = function() {
    return this.valueOf().replace(/[-_ ](.)/g, (_, char) => char.toUpperCase()).replace(/^(.)/, (_, char) => char.toUpperCase());
}

global.isObjectID = validation.base.ValidationBase.isObjectID;
global.isCompleteDoc = validation.base.ValidationBase.isCompleteDoc;
