const StringTemplateBuilder = require('@STRING');

/**
 * Class representing a set of utility tools for the command-line interface.
 */
class ToolsCLI {
    /**
     * Creates an instance of ToolsCLI.
     * @constructor
     */
    constructor() {
        /**
         * The StringTemplateBuilder instance used for constructing string templates.
         * @type {StringTemplateBuilder}
         */
        this.StringBuilder = StringTemplateBuilder;
    }

    /**
     * Prints a message to the console with optional header and project name.
     * @param {string} txt - The text to be printed.
     * @param {string} [addHeader] - The optional header to be added to the message.
     */
    print(txt, addHeader) {
        console.log(`${addHeader ? `[${addHeader}]` : '[LOG]'}[${API.projectName.toUpperCase()}] -> ${txt}`);
    }

    /**
     * Prints an error message to the console, including error name, message, and stack trace.
     * @param {Error} err - The error object to be printed.
     */
    printError(err) {
        console.error(`[ERROR][${global.API ? API.projectName.toUpperCase() : 'API'}][${err.name}] -> ${err.message}\nERROR-STACK:\n${err.stack}`);
    }

    /**
     * Prints a string template content to the console.
     * @param {string} stringContent - The string template content to be printed.
     */
    printTemplate(stringContent) {
        if (typeof stringContent === 'string') {
            console.log(`${stringContent || ''}`);
        }
    }

    /**
     * Prints tabular data to the console as a table.
     * @param {Object} data - The data to be displayed in the table.
     * @param {Object} [options] - Additional options for printing the table, including headers.
     */
    printTable(data, options) {
        const { headers } = options || {};
        let tableData = { ...data };

        if (typeof tableData === 'object') {
            console.table(tableData, headers);
        }
    }

    /**
     * Converts a user input to a boolean value, considering 'y' or 'n' as affirmative and negative answers, respectively.
     * @param {string} a - The user input to be converted to a boolean value ('y' or 'n').
     * @param {boolean} [strict=false] - If set to true, strict mode requires 'y' or 'n' input only.
     * @returns {boolean} The boolean value based on the user input.
     * @throws {Error.Log} When strict mode is enabled and the input is not 'y' or 'n'.
     */
    boolAnswer(a, strict = false) {
        if (a.toLowerCase() === 'y') return true;
        if (a.toLowerCase() === 'n') return false;

        if (strict) {
            throw new Error.Log({
                name: 'BoolAnswerError',
                message: `When the tool boolAnswer is configured to strict mode, it requires a strict answer, "y" or "n"! But received "${a}".`
            });
        }

        return false;
    }
}

/**
 * A set of utility tools for the command-line interface.
 * @module ToolsCLI
 */
module.exports = ToolsCLI;
