const LogBase = require('../maps/LogMap');
const ValidationError = require('mongoose/lib/error/validation');
const CastError = require('mongoose/lib/error/cast');
const config = require('@config');

class ErrorLog extends LogBase {
    constructor({
        stack,
        errorList
    }, ...stringArgsParams) {
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

    async saveLog() {
        const schemas = require('../../schemas');
        
        try {
            const newLog = new schemas.logs.DB({
                type: this.type,
                name: this.name,
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

    consolePrint() {
        toolsCLI.printError(this);
        return this;
    }
}

module.exports = ErrorLog;
