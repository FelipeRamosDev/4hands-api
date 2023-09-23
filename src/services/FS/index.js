const fs = require('fs');
const path = require('path');

class FileSystemService {
    static isExist(path) {
        return fs.existsSync(path);
    }

    static readFileSync(path) {
        return fs.readFileSync(path, { encoding: 'utf-8' });
    }

    static async readFile(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, dataBuff) => {
                if (err) throw reject(new Error.Log(err));
                
                return resolve(dataBuff);
            });
        });
    }

    static async writeFile(path, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, data, err => {
                if (err) return reject(err);

                return resolve(Object().toSuccess());
            });
        });
    }

    static async writeJSON(path, jsObject) {
        try {
            return await this.writeFile(path, JSON.stringify(jsObject, null, 4) + '\n');
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    static async copyFiles(filesToCopy, sourceDir, destDir) {
        if (!Array.isArray(filesToCopy)) {
            throw new Error.Log({
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
                            if (err) throw reject(new Error.Log(err));
            
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
            throw new Error.Log(err);
        }
    }
}

module.exports = FileSystemService;
