const StringTemplateBuilder = require('@STRING');
const config = require('@config');

class ToolsCLI {
    constructor() {
        this.StringBuilder = StringTemplateBuilder;
    }

    print(txt, addHeader) {
        console.log(`${addHeader ? `[${addHeader}]` : '[LOG]'}[${config.projectName.toUpperCase()}] -> ${txt}`);
    }

    printError(err) {
        console.error(`[ERROR][${config.projectName.toUpperCase()}][${err.name}] -> ${err.message}\nERROR-STACK:\n${err.stack}`);
    }

    printTemplate(stringContent) {
        if (typeof stringContent === 'string') {
            console.log(`${stringContent || ''}`);
        }
    }

    printTable(data, options) {
        const {headers} = options || {};
        let tableData = {...data};
        
        if (typeof tableData === 'object') {
            console.table(tableData, headers);
        }
    }

    boolAnswer(a, strict) {
        if (a.toLowerCase() === 'y') return true;
        if (a.toLowerCase() === 'n') return false;

        if (strict) throw new Error.Log({
            name: 'BoolAnswerError',
            message: `When the tool boolAnswer is configured to strict mode, it requires a strict answer, "y" or "n"! But received "${a}".`
        });

        return false;
    }
}

module.exports = ToolsCLI;
