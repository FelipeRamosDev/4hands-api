const fs = require('fs');
const path = require('path');

/**
 * Utility class for file system operations.
 * @module FileSystemService
 * @namespace Services
 */
class FileSystemService {
    /**
     * Checks if a file or directory exists at the specified path.
     * @param {string} path - The path to the file or directory.
     * @returns {boolean} True if the file or directory exists, false otherwise.
     */
    static isExist(path) {
        return fs.existsSync(path);
    }

    /**
     * Reads and returns the content of a file synchronously as a string.
     * @param {string} path - The path to the file.
     * @returns {string} The content of the file.
     */
    static readFileSync(path) {
        return fs.readFileSync(path, { encoding: 'utf-8' });
    }

    /**
     * Asynchronously reads the content of a file and resolves with the data buffer.
     * @param {string} path - The path to the file.
     * @returns {Promise<Buffer>} A Promise that resolves with the data buffer of the file.
     */
    static async readFile(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, dataBuff) => {
                if (err) throw reject(logError(err));
                
                return resolve(dataBuff);
            });
        });
    }

    /**
     * Asynchronously writes data to a file.
     * @param {string} path - The path to the file.
     * @param {string} data - The data to be written to the file.
     * @returns {Promise} A Promise that resolves when the write operation is completed.
     */
    static async writeFile(path, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, data, err => {
                if (err) return reject(err);

                return resolve(Object().toSuccess());
            });
        });
    }

    /**
     * Asynchronously writes a JavaScript object to a JSON file.
     * @param {string} path - The path to the JSON file.
     * @param {Object} jsObject - The JavaScript object to be converted to JSON.
     * @returns {Promise} A Promise that resolves when the write operation is completed.
     * @throws {Error.Log} If an error occurs during the write operation.
     */
    static async writeJSON(path, jsObject) {
        try {
            return await this.writeFile(path, JSON.stringify(jsObject, null, 4) + '\n');
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Asynchronously copies an array of files from the source directory to the destination directory.
     * @param {Array} filesToCopy - Array of file objects with 'filename' property indicating the file path.
     * @param {string} sourceDir - The source directory from where files are copied.
     * @param {string} destDir - The destination directory where files are copied.
     * @returns {Promise<Array>} A Promise that resolves with an array of copied file paths.
     * @throws {Error.Log} If the 'filesToCopy' parameter is not an array or if any error occurs during file copy.
     */
    static async copyFiles(filesToCopy, sourceDir, destDir) {
        if (!Array.isArray(filesToCopy)) {
            throw logError({
                name: 'ServicesFSCopyFilesInvalidParam',
                message: `The param "filesToCopy" should be an array but received ${filesToCopy}`
            });
        }

        try {
            const promises = [];

            filesToCopy.forEach((file) => {
                const urlSplitted = file.filename.split('/');
                const fileName = urlSplitted[urlSplitted.length - 1];
                let newSourceDir = sourceDir;
                let newDestDir = destDir;

                if (urlSplitted.length > 1) {
                    urlSplitted.pop();
                    newSourceDir += '/' + urlSplitted.join('/');
                    newDestDir += '/' + urlSplitted.join('/');
                }

                promises.push(new Promise((resolve, reject) => {
                    const sourcePath = path.join(newSourceDir, fileName);
                    const destPath = path.join(newDestDir, fileName);

                    if (!fs.existsSync(newDestDir)) {
                        fs.mkdirSync(newDestDir, { recursive: true });
                    }

                    if (fs.existsSync(sourcePath)) {
                        fs.copyFile(sourcePath, destPath, (err) => {
                            if (err) throw reject(logError(err));
            
                            console.log(`${file} was copied to ${destPath}`);
                            return resolve(file.filename);
                        });
                    } else {
                        return resolve(file.filename);
                    }
                }));
            });

            const solved = await Promise.all(promises);
            return solved;
        } catch (err) {
            throw logError(err);
        }
    }
}

module.exports = FileSystemService;
