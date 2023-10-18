const SafeValue = require('@models/collections/SafeValue');
const AuthService = require('@services/Auth');

class SafeValueClass {
    static BSModel = SafeValue;

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
