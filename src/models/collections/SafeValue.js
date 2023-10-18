const _Global = require('../maps/_Global');
const AuthService = require('@services/Auth');

class SafeValue extends _Global {
    constructor(setup) {
        super(setup);

        try {
            const { encrypted, type, algorithm, iv, salt, derivatedKey } = Object(setup);

            if (!type) {
                throw 'The param "type" should be "hash" or "encrypt" but received undefined!';
            }

            this.collectionName = 'safe_values';
            this.type = type;
            this.authService = new AuthService({ parent: this });
            this.algorithm = algorithm || 'aes-256-ctr';

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

    static async createEncrypt(rawValue) {
        const CRUD = require('@CRUD');

        return await CRUD.create('safe_values', {
            type: 'encrypt',
            rawValue
        });
    }

    async updateEncrypted(newValue) {
        const CRUD = require('@CRUD');

        return await CRUD.update({
            collectionName: 'safe_values',
            filter: this._id,
            data: { rawValue: newValue }
        });
    }

    value(secret) {

    }
}

module.exports = SafeValue;
