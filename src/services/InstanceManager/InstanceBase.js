const crypto = require('crypto');

class InstanceBase {
    constructor(setup) {
        const { id, tagName, onReady, onData, onClose, onError } = Object(setup);

        this.id = id || this.genRandomBytes();
        this.tagName = tagName || this.id;

        this.callbacks = {
            onReady,
            onData,
            onClose,
            onError
        };
    }

    genRandomBytes(bytes = 4) {
        return crypto.randomBytes(bytes).toString('hex');
    }
}

module.exports = InstanceBase;
