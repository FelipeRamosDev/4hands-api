const AuthService = require('@services/Auth');

module.exports = {
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
