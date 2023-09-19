const xml2js = require('xml2js');
const fs = require('fs');

class XMLManager {
    constructor({
        fullPath,
        outputFileName
    }) {
        this.fullPath = fullPath || '';
        this.fullPathArray = this.fullPath.split('/');
        this.inputFileName = this.fullPathArray[this.fullPathArray.length - 1];
        this.outputFileName = outputFileName || this.inputFileName;
    }

    async getParsedXML(path) {
        try {
            const stringFile = await this.getFile(path || this.fullPath);
            const parsedXML = await this.parseFile(stringFile);

            return parsedXML;
        } catch(err) {
            return new Error.Log(err).append('services.XMLManager.loading_file').append('services.XMLManager.parsing_xml');
        }
    }

    async getFile(filePath) {
        return await new Promise((resolve, reject) => {
            fs.readFile((filePath || this.fullPath), 'utf-8', (err, data) => {
                if (err) {
                    const error = new Error.Log(err).append('services.XMLManager.loading_file');
                    return resolve(error);
                }
              
                return resolve(data);
            });
        });
    }

    async parseFile(stringData) {
        return await new Promise((resolve, reject) => {
            xml2js.parseString(stringData, (err, result) => {
                if (err) {
                    const error = new Error.Log(err).append('services.XMLManager.parsing_xml')
                    return resolve(error);
                }
                
                return resolve(result);
            });
        });
    }

    async saveFile(obj, path) {
        return new Promise((resolve, reject) => {
            const builder = new xml2js.Builder({
                renderOpts: {
                    pretty: true,
                    xmldec: { encoding: 'UTF-8', standalone: null },
                    indent: '    ',
                    newline: '\n'
                },
                includeWhiteChars: true
            });
    
            const xml = builder.buildObject(obj);
            fs.writeFile(path || this.fullPath, xml, (err) => {
                if (err) {
                    const error = new Error.Log(err).append('services.XMLManager.saving_file');
                    return resolve(error);
                }
              
                console.log('File created with success!');
                return resolve(xml);
            });
        })
    }
}

module.exports = XMLManager;
