const _Global = require('4hands-api/src/collections/Models/_globals.model');
const AuthService = require('4hands-api/src/services/Auth');

/**
 * Represents a utility class providing encryption and decryption methods for sensitive data.
 * It uses SafeValue and AuthService classes to perform encryption and decryption operations.
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
        const { encrypted, type, algorithm, iv, salt, derivatedKey } = Object(setup);

        try {
            if (!setup) {
                this.isEmpty = true;
            }

            this._collectionName = 'safe_values';
            this.type = type;
            this.algorithm = algorithm || 'aes-256-ctr';

            if (this.type === 'encrypt') {
                this.encrypted = encrypted;
                this.iv = iv;
                this.salt = salt;
                this.derivatedKey = derivatedKey;
            } else {
                delete this.encrypted;
                delete this.iv;
                delete this.salt;
                delete this.derivatedKey;
            }
        } catch (err) {
            throw logError(err);
        }
    }

    get authService() {
        return new AuthService({ parent: this });
    }

    /**
     * Retrieves a masked version of the decrypted data for display purposes.
     *
     * @returns {string|undefined} The masked version of the decrypted data or undefined if not encrypted.
     * @memberof SafeValue
     * @instance
     */
    get displayValue() {
        if (!this.encrypted) {
            return;
        }

        const value = this.authService.decryptToken(this.encrypted.toString(), this.iv.toString(), this.derivatedKey);
        const lengthToShow = parseInt(value.length * 0.15);
        let result = '';

        for (let i = 0; i < value.length; i++) {
            if ((i >= lengthToShow) && (i < (value.length - lengthToShow))) {
                result += '*';
            } else {
                result += value[i];
            }
        } 

        return result;
    }

    /**
     * Encrypts the raw value and returns the encryption details.
     *
     * @returns {Object|undefined} An object containing encryption details (salt, derivatedKey, iv, encrypted),
     * or undefined if raw value is missing.
     * @memberof SafeValue
     * @instance
     */
    get encrypt() {
        if (!this?.raw?.rawValue) {
            return;
        }

        const salt = this.authService.generateRandom();
        const derivatedKey = this.authService.generateKey(process.env.API_SECRET || global?.API?.API_SECRET, salt);
        const { iv, encryptedToken } = this.authService.encryptToken(this.raw.rawValue, derivatedKey);

        return {
            salt,
            derivatedKey,
            iv,
            encrypted: encryptedToken
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

    get readSync() {
        return this.read();
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
        return await CRUD.create('safe_values', {
            type: 'encrypt',
            rawValue
        });
    }

     /**
     * Decrypts and returns the original data from the SafeValue object.
     *
     * @returns {string|undefined} The decrypted original data, or undefined if the SafeValue is empty.
     */
    read() {
        if (this.isEmpty) return;

        return this.authService.decryptToken(this.encrypted.toString(), this.iv.toString(), this.derivatedKey);
    }
}

module.exports = SafeValue;
