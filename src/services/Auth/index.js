const Success = require('@SUCCESS');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const FS = require('@services/FS');
const config = require('@config');
const sessionCLI = FS.isExist(config.sessionPath) && require('@SESSION_CLI') || {};

class AuthService {
    constructor(setup) {
        const { parent } = Object(setup);

        this._parentBucket = () => parent;
    }

    get parentBucket() {
        return this._parentBucket && this._parentBucket();
    }

    get userUID() {
        return this.getSafe('parentBucket.userUID');
    }

    get secretKey() {
        return process.env.API_SECRET;
    }

    async signIn(password) {
        try {
            const isValid = await this.validateCredentials(password);

            if(!isValid) {
                return new Error.Log('auth.invalid_credentials');
            }

            return isValid.toSuccess('User is valid!');
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async genSalt(length) {
        try {
            const salt = await bcrypt.genSalt(length || 8);
            return salt;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async createHash(password, saltLength) {
        try {
            const salt = await this.genSalt(saltLength);
            const hash = await bcrypt.hash(password, salt);
            return hash;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    createUserToken() {
        try {
            const userName = this.getSafe('parentBucket.userName');
            const userUID = this.getSafe('parentBucket.userUID');
            const password = this.getSafe('parentBucket.password');
            const authBucketUID = this.getSafe('parentBucket._id');
            const token = JWT.sign({userName, password, userUID, authBucketUID}, this.secretKey, {expiresIn: Date.now() + 80000000});

            return token;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    genToken(data) {
        try {
            const token = JWT.sign(data, this.secretKey);
            return token;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    validateToken(token) {
        try {
            const isValid = JWT.verify(token, this.secretKey);
            const data = JWT.decode(token);

            if (isValid) {
                return data;
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async validateCredentials(password) {
        try {
            const isMatch = await bcrypt.compare(password, this.parentBucket.password.toString());
            return isMatch;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async createSessionCLI() {
        try {
            const token = this.createUserToken();

            debugger;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async dropSessionCLI(token) {
        try {
            const userData = this.validateToken(token);
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async signOut(token) {
        try {
            const userData = this.validateToken(token);
            
            if (userData instanceof Error.Log) {
                throw userData;
            }

            delete sessionCLI[userData.userUID];
            sessionCLI.currentUser = '';

            const sessionUpdated = await FS.writeJSON(config.sessionPath, sessionCLI);
            return sessionUpdated;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = AuthService;
