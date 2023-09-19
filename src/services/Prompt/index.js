const { execSync, exec } = require('child_process');
const readline = require('readline');
const ToolsCLI = require('@CLI/ToolsCLI');
const StringTemplate = require('@interface/StringTemplateBuilder');
const config = require('@config');
const toolsCLI = new ToolsCLI();

class Prompt {
    constructor(setup) {
        const {rootPath} = Object(setup);

        this.rootPath = rootPath || __dirname;
    }

    cmd(command, options, dontPrint) {
        try {
            if (command) {
                const cmd = execSync(command, {cwd: this.rootPath, ...options});

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
                return '>> No command provided!'
            }
        } catch(err) {
            return new Error.Log(err);
        }
    }

    async exec(cmd) {
        console.log('>> Starting prompt...');

        return new Promise((resolve, reject) => {
            try {
                const child = exec(cmd, {cwd: this.rootPath}, (err, stdout, stderr) => {
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
                    .text(`[QUESTION][${config.projectName.toUpperCase()}] -> ${questionText} `)
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
