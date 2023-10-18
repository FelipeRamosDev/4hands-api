const _Global = require('../maps/_Global');
const AuthService = require('@services/Auth');

class SafeValue extends _Global {
    constructor(setup) {
        super(Object(setup));

        try {
            const { encrypted, type, algorithm, iv, salt, derivatedKey, displayValue } = Object(setup);

            if (!setup) {
                this.isEmpty = true;
            }

            this.collectionName = 'safe_values';
            this.type = type;
            this.authService = new AuthService({ parent: this });
            this.algorithm = algorithm || 'aes-256-ctr';
            this.displayValue = displayValue;

            if (this.type === 'encrypt') {
                this.encrypted = encrypted;
                this.iv = iv;
                this.salt = salt;
                this.derivatedKey = derivatedKey;
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    get binString() {
        return this.encrypted.toString();
    }

    static async createEncrypt(rawValue) {
        const CRUD = require('@CRUD');

        return await CRUD.create('safe_values', {
            type: 'encrypt',
            rawValue
        });
    }

    async setEncrypted(newValue) {
        const CRUD = require('@CRUD');

        if (this.isEmpty) {
            return await SafeValue.createEncrypt(newValue);
        } else {
            return await CRUD.update({
                collectionName: 'safe_values',
                filter: this._id,
                data: { rawValue: newValue }
            });
        }
    }

    read() {
        if (this.isEmpty) return;

        return this.authService.decryptToken(this.encrypted.toString(), this.iv.toString(), this.derivatedKey.buffer);
    }
}

module.exports = SafeValue;
