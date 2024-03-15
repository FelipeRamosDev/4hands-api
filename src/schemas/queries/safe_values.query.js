const AuthService = require('4hands-api/src/services/Auth');

module.exports = {
    /**
     * Encrypts the provided raw value using a generated salt, a derived key from the API secret, and an initialization vector (iv).
     * 
     * @returns {Object} An object containing encryption details: salt, derived key, iv, and encrypted token.
     * @throws {Error} If there's an error during encryption process.
     * @function
     * @memberof module:EncryptionUtility
     */
    encrypt() {
        const authService = new AuthService();
        const salt = authService.generateRandom();
        const derivatedKey = authService.generateKey(process.env.API_SECRET, salt);
        const { iv, encryptedToken } = authService.encryptToken(this._update.rawValue, derivatedKey);

        return {
            salt,
            derivatedKey,
            iv,
            encrypted: encryptedToken
        }
    }
};
