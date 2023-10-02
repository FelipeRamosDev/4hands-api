const xml2js = require('xml2js');
const fs = require('fs');

/**
 * Manages operations related to XML files, including parsing, loading, and saving.
 */
class XMLManager {
    /**
     * Creates an instance of XMLManager.
     * @param {Object} options - Configuration options for XMLManager.
     * @param {string} options.fullPath - The full path to the XML file.
     * @param {string} options.outputFileName - The name of the output XML file (optional).
     */
    constructor({
        fullPath,
        outputFileName
    }) {
        /**
         * The full path to the XML file.
         * @type {string}
         */
        this.fullPath = fullPath || '';
        
        /**
         * The array containing individual parts of the full path.
         * @type {Array}
         */
        this.fullPathArray = this.fullPath.split('/');
        
        /**
         * The input file name extracted from the full path.
         * @type {string}
         */
        this.inputFileName = this.fullPathArray[this.fullPathArray.length - 1];
        
        /**
         * The name of the output XML file.
         * @type {string}
         */
        this.outputFileName = outputFileName || this.inputFileName;
    }

    /**
     * Retrieves and parses the XML file located at the specified path.
     * @param {string} [path] - The path to the XML file (optional, uses the instance's fullPath if not provided).
     * @returns {Promise<Object|Error>} - A promise that resolves with the parsed XML object or an Error object if parsing fails.
     */
    async getParsedXML(path) {
        try {
            const stringFile = await this.getFile(path || this.fullPath);
            const parsedXML = await this.parseFile(stringFile);

            return parsedXML;
        } catch(err) {
            return new Error.Log(err).append('services.XMLManager.loading_file').append('services.XMLManager.parsing_xml');
        }
    }

    /**
     * Reads the content of the specified file path.
     * @param {string} [filePath] - The path to the file to be read (optional, uses the instance's fullPath if not provided).
     * @returns {Promise<string|Error>} - A promise that resolves with the file content or an Error object if reading fails.
     */
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

    /**
     * Parses the given XML string into an object.
     * @param {string} stringData - The XML string to be parsed.
     * @returns {Promise<Object|Error>} - A promise that resolves with the parsed XML object or an Error object if parsing fails.
     */
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

    /**
     * Saves the given object as an XML file at the specified path.
     * @param {Object} obj - The object to be converted and saved as XML.
     * @param {string} [path] - The path where the XML file will be saved (optional, uses the instance's fullPath if not provided).
     * @returns {Promise<string|Error>} - A promise that resolves with the saved XML content or an Error object if saving fails.
     */
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
