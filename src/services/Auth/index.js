const Success = require('@SUCCESS');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const FS = require('@services/FS');
const config = require('@config');
const sessionCLI = FS.isExist(config.sessionPath) && require('@SESSION_CLI') || {};

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

        this._parentBucket = () => parent;
    }

    get parentBucket() {
        return this._parentBucket && this._parentBucket();
    }

    /**
     * Gets the user's unique identifier.
     * @type {string|undefined}
     */
    get userUID() {
        return this.getSafe('parentBucket.userUID');
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
                return new Error.Log('auth.invalid_credentials');
            }

            return isValid.toSuccess('User is valid!');
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    /**
     * Generates a salt for password hashing.
     * @async
     * @param {number} [length=8] - The length of the generated salt.
     * @returns {string} The generated salt.
     */
    async genSalt(length) {
        try {
            const salt = await bcrypt.genSalt(length || 8);
            return salt;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    /**
     * Creates a password hash using the provided password and salt length.
     * @async
     * @param {string} password - The password to be hashed.
     * @param {number} [saltLength=8] - The length of the salt for password hashing.
     * @returns {string} The hashed password.
     */
    async createHash(password, saltLength) {
        try {
            const salt = await this.genSalt(saltLength);
            const hash = await bcrypt.hash(password, salt);
            return hash;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    /**
     * Creates a JWT token for the user.
     * @returns {string} The generated JWT token.
     */
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

    
    /**
     * Creates a JWT token for the user.
     * @returns {string} The generated JWT token.
     */
    async createSessionToken(session) {
        try {
            const sessionSalt = await this.genSalt();
            const token = JWT.sign({ sessionID: session.id, sessionSalt }, this.secretKey, {expiresIn: Date.now() + 80000000});

            session.sessionSalt = sessionSalt;
            return token;
        } catch (err) {
            throw new Error.Log(err);
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
            throw new Error.Log(err);
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
            const isValid = JWT.verify(token, this.secretKey);
            const data = JWT.decode(token);

            if (isValid) {
                return data;
            }
        } catch (err) {
            throw new Error.Log(err);
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
            throw new Error.Log(err);
        }
    }

    /**
     * Creates a session for the Command-Line Interface (CLI) user.
     * @async
     * @returns {void}
     * @throws {Error.Log} If an error occurs during session creation.
     */
    async createSessionCLI() {
        try {
            const token = this.createUserToken();

            debugger;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    /**
     * Drops a session for the Command-Line Interface (CLI) user.
     * @async
     * @param {string} token - The JWT token representing the session to be dropped.
     * @returns {void}
     * @throws {Error.Log} If an error occurs during session dropping.
     */
    async dropSessionCLI(token) {
        try {
            const userData = this.validateToken(token);
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    /**
     * Signs out the user and deletes the corresponding session.
     * @async
     * @param {string} token - The JWT token representing the user's session.
     * @returns {boolean} True if the session is successfully deleted, false otherwise.
     * @throws {Error.Log} If an error occurs during sign-out.
     */
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

/**
 * @namespace Services
 * @module AuthService
 * @description Class representing an authentication service for handling user authentication and authorization.
 */
module.exports = AuthService;
