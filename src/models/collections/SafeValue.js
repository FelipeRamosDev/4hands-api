const _Global = require('../maps/_Global');

class SafeValue extends _Global {
    constructor(setup) {
        try {
            const { encrypted, type, algorithm } = Object(setup);

            this.encrypted = encrypted;
            this.type = type;
            this.algorithm = algorithm;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = SafeValue;
