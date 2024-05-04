
const fs = require('fs');
const path = require('path');

class ErrorLog {
    constructor (err) {
        this.error = true;

        if (typeof err === 'string') {
            this.message = err;
        }


        if (typeof err === 'object' && !Array.isArray(err)) {
            const { code, name, message, msg, type, stack } = Object(err);

            if (code) this.code = code;
            if (name) this.name = name;
            if (message) this.message = message;
            if (msg) this.msg = msg;
            if (type) this.type = type;
            if (stack) this.stack = stack;
        }

        if (!this.stack) {
            this.stack = new Error().stack
        }
    }

    get stackArray() {
        const array = this.stack.split('\n');

        array.splice(0, 1);
        return array.map(item => item.replace('    at ', ''));
    }

    get stackTemplate() {
        const msg = this.message || this.msg;
        let out = '';

        out += '------------------------------------------------------------------------------------------------------------------------------';
        if (this.name) out += `\n[ERROR] ${this.name}: ${msg ? msg : ''}\n\n`;
        if (this.stack) out += 'Stack: ' + this.stackArray.join('\n    ');
        out += '\n--------------------------------------------------------------------------------------------------------------------------------\n\n';

        return out;
    }

    toObject() {
        return { ...this };
    }

    print(...args) {
        console.log(this.stackTemplate);
        console.log(...args, '\n');
    }

    async writeLog() {
        const logFilePath = path.join(__dirname, 'errors.log');
        const logString = this.stackTemplate;
        
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
