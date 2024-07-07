const _Global = require('4hands-api/src/collections/Models/_globals.model');
const AuthService = require('4hands-api/src/services/Auth');
const AuthBucket = require('./auth_buckets.model');

/**
 * Represents a utility class providing encryption and decryption methods for sensitive data.
 * It uses SafeValue and AuthService classes to perform encryption and decryption operations.
 *
 * @class
 */
class SafeValue extends _Global {
    constructor (setup, parent) {
        super(setup, parent);
        const {
            auth
        } = Object(setup);

        /**
         * The AuthBucket instance associated with this user.
         * @private
         * @property {AuthBucket}
         */
        this._auth = () => auth && new AuthBucket(auth, this);
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

        const authService = new AuthService();
        const value = authService.decryptToken(this.encrypted.toString(), this.iv.toString(), this.derivatedKey);
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

        const authService = new AuthService();
        const salt = authService.generateRandom();
        const derivatedKey = authService.generateKey(process.env.API_SECRET || global?.API?.API_SECRET, salt);
        const { iv, encryptedToken } = authService.encryptToken(this.raw.rawValue, derivatedKey);

        return {
            salt,
            derivatedKey,
            iv,
            encrypted: encryptedToken
        }
    }
}

module.exports = SafeValue;
