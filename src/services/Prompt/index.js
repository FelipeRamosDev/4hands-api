const { execSync, exec } = require('child_process');
const readline = require('readline');
const ToolsCLI = require('@CLI/ToolsCLI');
const StringTemplate = require('@interface/StringTemplateBuilder');
const toolsCLI = new ToolsCLI();

/**
 * Represents a command line prompt utility.
 */
class Prompt {
    /**
     * Creates an instance of Prompt.
     * @param {Object} setup - Configuration options for the prompt.
     * @param {string} setup.rootPath - The root path for the prompt (defaults to the current directory).
     */
    constructor(setup) {
        const { rootPath } = Object(setup);
        /**
         * The root path for the prompt.
         * @type {string}
         */
        this.rootPath = rootPath || __dirname;
    }

    /**
     * Executes a command in the shell synchronously.
     * @param {string} command - The command to be executed.
     * @param {Object} options - Additional options for the execution.
     * @param {boolean} dontPrint - If true, the command output will not be printed (defaults to false).
     * @returns {Object|Error.Log} An object containing the execution result or an Error.Log object if an error occurs.
     */
    cmd(command, options, dontPrint) {
        try {
            if (command) {
                const cmd = execSync(command, { cwd: this.rootPath, ...options });

                if (cmd) {
                    const output = cmd.toString();
                    
                    output && !dontPrint && toolsCLI.print(output);
                    return {
                        success: true,
                        out: output
                    };
                }

                return new Error.Log(cmd);
            } else {
                return '>> No command provided!';
            }
        } catch(err) {
            return new Error.Log(err);
        }
    }

    /**
     * Asynchronously executes a command in the shell and returns a Promise.
     * @param {string} cmd - The command to be executed.
     * @returns {Promise} A Promise that resolves with the execution result.
     */
    async exec(cmd) {
        console.log('>> Starting prompt...');

        return new Promise((resolve, reject) => {
            try {
                const child = exec(cmd, { cwd: this.rootPath }, (err, stdout, stderr) => {
                    if (err) {
                        console.error(stderr);
                        return reject(new Error.Log(err));
                    }
    
                    child.kill();
                    console.log('>> Prompt Killed!');
                    return resolve({
                        success: true,
                        out: stdout,
                        prompt: child
                    });
                });
            } catch(err) {
                return reject(new Error.Log(err));
            }
        });
    }

    /**
     * Asynchronously asks a question in the terminal and returns the user's input as a Promise.
     * @param {string} questionText - The text of the question to be asked.
     * @returns {Promise<string>} A Promise that resolves with the user's input.
     */
    async question(questionText) {
        return new Promise((resolve, reject) => {
            try {
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                const question = new StringTemplate()
                    .separator()
                    .newLine()
                    .text(`[QUESTION][${global.api.projectName.toUpperCase()}] -> ${questionText} `)
                .end();

                rl.question(question, (answer) => {
                    rl.close();
                    const separator = new StringTemplate();
                    separator.separator();
                    console.log(separator.end());
                    resolve(answer);
                });
            } catch(err) {
                reject(err);
            }
        });
    }

    /**
     * Converts parameters into a string format suitable for command-line arguments.
     * @param {Array|Object|string} params - The parameters to be converted.
     * @returns {string} A string representation of the parameters for command-line use.
     * @throws {Error.Log} If an error occurs during parameter conversion.
     */
    strigifyParams(params) {
        let stringParams = '';

        if (!params) {
            return '';
        }

        try {
            if (Array.isArray(params)) {
                for (let i = 0; params.length; i = i + 2) {
                    const [key, value] = params;
                    stringParams += ' --' + key + '=' + value;
                }
            } else if (typeof params === 'object') {
                Object.keys(params || {}).map(key => {
                    stringParams += ' --' + key + '=' + params[key];
                });
            } 
            
            if (typeof params === 'string') {
                stringParams = params;
            }
    
            return stringParams;
        } catch(err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Prompt;
