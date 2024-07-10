const Success = require('4hands-api/src/models/Success');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Class representing an authentication service for handling user authentication and authorization.
 */
class AuthService {
    /**
     * Creates an instance of AuthService.
     * @constructor
     * @param {Object} setup - The setup object containing optional parameters.
     * @param {Object} setup.parent - The parent object to which this AuthService instance belongs.
     */
    constructor(setup) {
        const { parent } = Object(setup);

        this.algorithm = 'aes-256-ctr';
        this._parentBucket = () => parent;
    }

    /**
     * The parent object: master account, slot, position, etc.
     */
    get parentBucket() {
        return this._parentBucket && this._parentBucket();
    }

    /**
     * Gets the user's unique identifier.
     * @type {string|undefined}
     */
    get userUID() {
        return this.parentBucket?.userUID;
    }

    /**
     * Gets the secret key for generating JWT tokens.
     * @type {string}
     */
    get secretKey() {
        return process.env.API_SECRET;
    }

    /**
     * Validates user credentials and signs in the user.
     * @async
     * @param {string} password - The user's password to be validated.
     * @returns {Success|Error.Log} A Success object if authentication is successful, or an Error.Log object if authentication fails.
     */
    async signIn(password) {
        try {
            const isValid = await this.validateCredentials(password);

            if(!isValid) {
                return logError('auth.invalid_credentials');
            }

            return isValid.toSuccess('User is valid!');
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * To generate a key using PBKDF2
     * @param {string} SECRET_KEY 
     * @param {Buffer} salt 
     * @returns {Buffer} 100000 iterations, 32-byte key
     */
    generateKey(SECRET_KEY, salt) {
        return crypto.pbkdf2Sync(SECRET_KEY, salt, 100000, 32, 'sha512');
    }

    /**
     * To generate a random IV (Initialization Vector)
     * @returns {Buffer} 16 bytes (128 bits) IV for AES-256
     */
    generateRandom(length) {
        return crypto.randomBytes(length || 16);
    }

    /**
     * To encrypt a token
     * @param {string} token The string token you'd like to encrypt.
     * @param {Buffer} key The key's buffer.
     * @returns {Object} Returns an object with the "iv" and the "encryptedToken".
     */
    encryptToken(token, key) {
        const iv = this.generateRandom();
        const cipher = crypto.createCipheriv(this.algorithm, key, iv);

        return {
          iv: iv.toString('hex'),
          encryptedToken: cipher.update(token, 'utf8', 'hex') + cipher.final('hex'),
        };
    }

    /**
     * To decrypt a token
     * @param {string} encryptedToken The encrypted string token.
     * @param {Buffer} iv The "iv" used on the encrypt generator.
     * @param {Buffer} derivatedKey The key's buffer used on the encryptToken() "key" param.
     * @returns {string} The decrypted string of the value.
     */
    decryptToken(encryptedToken, iv, derivatedKey) {
        const decipher = crypto.createDecipheriv(this.algorithm, new Int8Array(derivatedKey), Buffer.from(iv, 'hex'));
        return decipher.update(encryptedToken, 'hex', 'utf8') + decipher.final('utf8');
    }

    /**
     * Generates a salt for password hashing.
     * @param {number} [length=8] - The length of the generated salt. Default is 8.
     * @returns {string} The generated salt.
     */
    async genSalt(length) {
        try {
            const salt = await bcrypt.genSalt(length || 8);
            return salt;
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Creates a password hash using the provided password and salt length.
     * @param {string} password - The password to be hashed.
     * @param {number} [saltLength=8] - The length of the salt for password hashing.
     * @returns {string} The hashed password.
     */
    async createHash(password, saltLength) {
        try {
            const salt = await this.genSalt(saltLength);
            const hash = bcrypt.hash(password, salt);
            return hash;
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Creates a JWT token for the user.
     * @returns {string} The generated JWT token.
     */
    createUserToken() {
        try {
            const userName = this.parentBucket?.userName;
            const userUID = this.parentBucket?.userUID;
            const password = this.parentBucket?.password;
            const authBucketUID = this.parentBucket?._id;
            const token = JWT.sign({userName, password, userUID, authBucketUID}, this.secretKey, {expiresIn: Date.now() + 80000000});

            return token;
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Creates a JWT session token for the user.
     * @returns {string} The generated JWT token.
     */
    async createSessionToken(session) {
        try {
            const sessionSalt = await this.genSalt();
            const token = JWT.sign({ sessionID: session.id, sessionSalt }, this.secretKey, {expiresIn: Date.now() + 80000000});

            session.sessionSalt = sessionSalt;
            return token;
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Creates a JWT reset token for the user reset his password.
     * @returns {string} The generated JWT token.
     */
    async createResetToken(sessionID, userEmail, expiresIn) {
        try {
            const token = JWT.sign({ sessionID, userEmail }, this.secretKey, { expiresIn: expiresIn || (Date.now() + 80000000)});
            return token;
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Generates a JWT token based on the provided data.
     * @param {Object} data - The data to be encoded into the JWT token.
     * @returns {string} The generated JWT token.
     */
    genToken(data) {
        try {
            const token = JWT.sign(data, this.secretKey);
            return token;
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Validates a JWT token.
     * @param {string} token - The JWT token to be validated.
     * @returns {Object} The decoded data from the validated JWT token.
     * @throws {Error.Log} If the token validation fails.
     */
    validateToken(token) {
        try {
            if (typeof token !== 'string') {
                return;
            }

            const isValid = JWT.verify(token, this.secretKey);
            const data = JWT.decode(token);

            if (isValid) {
                return data;
            }
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Validates user credentials against the stored password hash.
     * @async
     * @param {string} password - The user's input password to be validated.
     * @returns {boolean} True if the password matches the stored hash, false otherwise.
     */
    async validateCredentials(password) {
        try {
            const isMatch = await bcrypt.compare(password, this.parentBucket.password.toString());
            return isMatch;
        } catch (err) {
            throw logError(err);
        }
    }
}

/**
 * @namespace Services
 * @module AuthService
 * @description Class representing an authentication service for handling user authentication and authorization.
 */
module.exports = AuthService;
