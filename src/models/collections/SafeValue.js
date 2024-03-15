const _Global = require('../maps/_Global');
const AuthService = require('4hands-api/src/services/Auth');

/**
 * Represents a SafeValue object used for encrypting and decrypting sensitive data.
 * Extends _Global class and encapsulates encryption and decryption functionality.
 *
 * @class
 */
class SafeValue extends _Global {
    /**
     * Creates a new SafeValue instance with the provided setup parameters.
     *
     * @constructor
     * @param {Object} setup - The setup object containing encryption details (encrypted, type, algorithm, iv, salt, derivatedKey, displayValue).
     * @throws {Error} If there's an error during instantiation, it is caught and logged.
     */
    constructor(setup) {
        super(Object(setup));
        const { encrypted, type, algorithm, iv, salt, derivatedKey, displayValue } = Object(setup);

        try {
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

    /**
     * Returns the binary string representation of the encrypted data.
     *
     * @readonly
     * @returns {string} Binary string representation of the encrypted data.
     */
    get binString() {
        return this.encrypted.toString();
    }

    /**
     * Creates a new encrypted SafeValue instance with the given raw value.
     *
     * @param {string} rawValue - The raw value to be encrypted.
     * @returns {Promise<Object>} A Promise that resolves to the created SafeValue object.
     * @async
     * @static
     */
    static async createEncrypt(rawValue) {
        const CRUD = require('4hands-api/src/services/database/crud');

        return await CRUD.create('safe_values', {
            type: 'encrypt',
            rawValue
        });
    }

    /**
     * Updates the encrypted data with a new encrypted value.
     *
     * @param {string} newValue - The new encrypted value to be set.
     * @returns {Promise<Object>} A Promise that resolves to the updated SafeValue object.
     * @async
     */
    async setEncrypted(newValue) {
        const CRUD = require('4hands-api/src/services/database/crud');

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

     /**
     * Decrypts and returns the original data from the SafeValue object.
     *
     * @returns {string|undefined} The decrypted original data, or undefined if the SafeValue is empty.
     */
    read() {
        if (this.isEmpty) return;

        return this.authService.decryptToken(this.encrypted.toString(), this.iv.toString(), this.derivatedKey.buffer);
    }
}

module.exports = SafeValue;
