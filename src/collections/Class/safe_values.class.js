const SafeValue = require('4hands-api/src/models/collections/SafeValue');
const AuthService = require('4hands-api/src/services/Auth');

/**
 * Represents a utility class providing encryption and decryption methods for sensitive data.
 * It uses SafeValue and AuthService classes to perform encryption and decryption operations.
 *
 * @class
 */
class SafeValueClass {
    /**
     * The SafeValue class used for encryption and decryption operations.
     * @type {SafeValue}
     * @static
     */
    static BSModel = SafeValue;

    /**
     * Retrieves a masked version of the decrypted data for display purposes.
     *
     * @returns {string|undefined} The masked version of the decrypted data or undefined if not encrypted.
     * @memberof SafeValueClass
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
     * @memberof SafeValueClass
     * @instance
     */
    get encrypt() {
        if (!this?.raw?.rawValue) {
            return;
        }

        const authService = new AuthService();
        const salt = authService.generateRandom();
        const derivatedKey = authService.generateKey(process.env.API_SECRET, salt);
        const { iv, encryptedToken } = authService.encryptToken(this.raw.rawValue, derivatedKey);

        return {
            salt,
            derivatedKey,
            iv,
            encrypted: encryptedToken
        }
    }
}

module.exports = SafeValueClass;
