const crypto = require('crypto');

class InstanceBase {
    constructor(setup) {
        const {
            id,
            tagName,
            filePath,
            dataStore = {},
            onReady = () => {},
            onData = () => {},
            onClose = () => {},
            onError = () => {},
            parent
        } = Object(setup);

        this._parent = () => parent;
        this._dataStore = dataStore;

        this.id = id || this.genRandomBytes();
        this.tagName = tagName || this.id;
        this.filePath = filePath;

        // Storing handlers
        this.callbacks = {
            onReady,
            onData,
            onClose,
            onError
        };
    }

    get parent() {
        return this._parent();
    }

    genRandomBytes(bytes = 4) {
        return crypto.randomBytes(bytes).toString('hex');
    }

    getAllValues() {
        return this._dataStore;
    }

    getValue(key) {
        return this._dataStore[key];
    }

    setValue(key, value) {
        this._dataStore[key] = value;
        return value;
    }

    deleteValue(key) {
        delete this._dataStore[key];
    }
}

module.exports = InstanceBase;
