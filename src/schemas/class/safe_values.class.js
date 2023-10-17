const SafeValue = require('@models/collections/SafeValue');
const AuthService = require('@services/Auth');

class SafeValueClass {
    static BSModel = SafeValue;

    get encrypt() {
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
