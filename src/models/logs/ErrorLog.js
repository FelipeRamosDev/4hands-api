const LogBase = require('../maps/LogMap');
const ValidationError = require('mongoose/lib/error/validation');
const CastError = require('mongoose/lib/error/cast');
const config = require('4hands-api/configs/project');

/**
 * Represents an error log entry in the application.
 * @module ErrorLog
 * @extends LogBase
 * @namespace Models
 */
class ErrorLog extends LogBase {
    /**
     * Creates a new instance of the ErrorLog class.
     * @param {Object} args - The error log parameters.
     * @param {...string} stringArgsParams - Additional string parameters.
     * @throws {Error} If the creation of error log fails.
     */
    constructor(setup, ...stringArgsParams) {
        const { stack, errorList } = Object(setup);
        let args = arguments[0] || {};
        let stringArgs;

        if (Boolean.isValid(args).stringFilled()) {
            try {
                stringArgs = String(args);
                args = Resource.error(args, ...stringArgsParams);
            } catch(err) {
                console.error(err);
                throw err;
            }
        }
    
        super(args);
        if (stringArgs) this.resource = stringArgs;

        if (Boolean.isValid(args).stringFilled()) {
            const errorData = Resource.error(args);

            if (errorData) {
                this.name = errorData.name;
                this.code = args.code;
                this.message = errorData.message;
            }
        }

        this.type = 'error';
        this.error = true;
        this.stack = stack || `${this.name}: ${this.message}`;
        this.errorList = errorList || [{ name: this.name, message: this.message }];
        this.validationErrors = args.validationErrors || [];

        // Checking if it's a database error
        if (Boolean.isValid(args).filled().object().eval()) {
            if (args instanceof ValidationError) {
                if (Boolean.isValid(args).path('errors').object().eval()) {
                    this.validationErrors = [...Object.keys(args.errors).map(key => args.errors[key]), ...this.validationErrors];
                }
            }
            if (args instanceof CastError) {
                this.validationErrors = [args, ...this.validationErrors];
            }
        }
    }

    /**
     * Asynchronously saves the error log to the database.
     * @async
     * @returns {Promise<ErrorLog>} - A promise resolving to the saved ErrorLog instance.
     * @throws {Error} If there is an error during the saving process.
     */
    async saveLog() {
        const schemas = require('../../schemas');
        
        try {
            const newLog = new schemas.logs.DB({
                type: this.type,
                name: this.name,
                code: this.code,
                message: this.message,
                resource: this.resource,
                stack: this.stack,
                errorList: JSON.stringify(this.errorList),
                validationErrors: JSON.stringify(this.validationErrors),
                additionalData: this.additionalData
            });
            await newLog.save();
            return this;
        } catch(err) {
            throw Resource.error('database.saving_log', err.name, err.message);
        }
    }

    /**
     * Appends additional error information to the error log.
     * @param {Object|string} append - The error object or string to append.
     * @param {...string} params - Additional parameters for error information.
     * @returns {ErrorLog} - The ErrorLog instance with appended information.
     */
    append(append, ...params) {
        if (Boolean.isValid(append).filled().eval()) {
            if (Boolean.isValid(append).filled().string().eval()) {
                const errorData = Resource.error(append, ...params);

                if (errorData) {
                    this.resource = append;
                    errorData.errorPath = this.resource;
                    append = errorData;
                }
            }

            if (Boolean.isValid(append).filled().object().eval()) {
                this.errorList = [append, ...this.errorList];
                this.stack = `${append.name}: ${append.message}\n` + this.stack;
            }
        }

        if (config.mode === 'development') this.consolePrint(this);
        return this;
    }

    /**
     * Generates a response object representing the error log.
     * @returns {Object} - The response object containing error details.
     */
    response() {
        return {
            success: false,
            code: this.code,
            resource: this.resource,
            name: this.name,
            message: this.message,
            errors: this.errorList,
            validationErrors: this.validationErrors
        }
    }

    /**
     * Prints the error log to the console.
     * @returns {ErrorLog} - The ErrorLog instance for method chaining.
     */
    consolePrint() {
        toolsCLI.printError(this);
        return this;
    }
}

module.exports = ErrorLog;
