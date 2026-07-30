const ajax = require('./ajax');
const Resource = require('../resources/Resources');
const validation = require('../validation');
const ErrorLog = require('../models/ErrorLog');
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
 * @name logError - To log errors to the errors.log file.
 */
global.logError = ErrorLog.logError;

/**
 * @global
 * @name toError - Build and return a ErroLog object.
 */
global.toError = ErrorLog.toError;

// Utils
Boolean.isValid = validation.base.build;

/**
 * @method oid
 * @description Method that evaluate if the provided object on "Object(objectToEval)" is a mongoose ObjectID or not. 
 * @returns {boolean}
 */
global.oid = function(toValue) {
    const isValid = validation.base.ValidationBase.isObjectID(toValue);

    if (toValue) {
        return isValid ? toValue.valueOf() : {};
    } else {
        return isValid;
    }
}

Date.convertToMillis = utils.convertToMillis;
Date.convertMillisTo = utils.convertMillisTo;

String.prototype.toCamelCase = function() {
    return this.valueOf().replace(/[-_ ](.)/g, (_, char) => char.toUpperCase()).replace(/^(.)/, (_, char) => char.toUpperCase());
}

global.isObjectID = validation.base.ValidationBase.isObjectID;
global.isCompleteDoc = validation.base.ValidationBase.isCompleteDoc;
