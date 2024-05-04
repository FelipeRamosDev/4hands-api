const fs = require('fs');
const path = require('path');

class ErrorLog {
    constructor (err, merge = {}) {
        this.error = true;

        if (!err) {
            this.name = 'UNKNOW_ERROR';
            this.message = 'An unknow error was caught!'
        }

        if (typeof err === 'string') {
            const rsc = Resource.error(err);

            if (rsc) {
                this.name = rsc.name;
                this.message = rsc.message;
            } else {
                this.message = err;
            }
        }


        if (typeof err === 'object' && !Array.isArray(err)) {
            const { code, name, message, msg, type, stack } = Object(err);

            if (code) this.code = code;
            if (name) this.name = name;
            if (message || msg) this.message = message || msg;
            if (type) this.type = type;
            if (stack) this.stack = stack;
        }

        if (!this.stack) {
            this.stack = new Error().stack
        }

        if (!Array.isArray(merge) && typeof merge === 'object') {
            Object.keys(merge).map(key => {
                this[key] = merge[key];
            });
        }
    }

    get stackArray() {
        const array = this.stack.split('\n');

        array.splice(0, 1);
        return array.map(item => item.replace('    at ', ''));
    }

    stackTemplate() {
        const date = new Date();
        const msg = this.message || this.msg;
        let out = '\n';

        if (this.name) out += `[${date.toLocaleDateString()} - ${date.toLocaleTimeString()}] ${this.name}: ${msg ? msg : ''}\n\n`;
        if (this.stack) out += 'Stack: ' + this.stackArray.join('\n    ');
        out += '\n--------------------------------------------------------------------------------------------------------------------------------\n\n';

        return out;
    }

    toObject() {
        return { ...this };
    }

    print() {
        console.error(this.stackTemplate(), '\n');
    }

    printWarn() {
        console.warn(this.stackTemplate(), '\n');
    }

    async writeLog() {
        const projectPath = path.normalize(__dirname.replace(path.normalize('/node_modules/4hands-api/src/models'), '/'));
        const logFilePath = path.join(projectPath, 'errors.log');
        const logString = this.stackTemplate();
        
        // Check if the log file exists
        if (!fs.existsSync(logFilePath)) {
          // Create the file if it doesn't exist
          fs.writeFileSync(logFilePath, '');
        }
        
        // Append the log message to the file
        fs.appendFile(logFilePath, logString, (err) => {
          if (err) {
            console.error('Error writing to the log file:', err);
          }
        });
    }

    append() {}
    static logError(err) {
        const error = new ErrorLog(err);
        
        error.writeLog();
        return error;
    }
}

module.exports = ErrorLog;
