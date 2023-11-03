const _Global = require('../maps/_Global');
const AuthBucket = require('./AuthBucket');
const AuthService = require('../../services/Auth');
const CRUD = require('@CRUD');
const dbHelpers = require('@helpers/database/dbHelpers');
const FS = require('@services/FS');
const config = require('@config');
const sessionCLI = FS.isExist(config.sessionPath) && require('@SESSION_CLI') || {};

/**
 * Represents a user in the application.
 * @module User
 * @extends _Global
 * @namespace Models
 */
class User extends _Global {
    /**
     * Creates a new instance of the User class.
     * @param {Object} setup - The setup object containing user details.
     * @throws {Error.Log} If setup parameters are missing or invalid.
     */
    constructor(setup) {
        super({...setup, validationRules: 'users'}, () => this);
        if (!setup || setup.oid()) return;

        const {
            auth,
            userName,
            firstName,
            lastName,
            email,
            phone,
            isEmailConfirmed
        } = Object(setup);

        try {
            /**
             * The collection name for this user.
             * @property {string}
             */
            this.collectionName = 'users';

            /**
             * The username associated with this user.
             * @property {string}
             */
            this.userName = userName;

            /**
             * The display name of the user.
             * @property {string}
             */
            this.displayName = `${firstName} ${lastName}`;

            /**
             * The first name of the user.
             * @property {string}
             */
            this.firstName = firstName;

            /**
             * The last name of the user.
             * @property {string}
             */
            this.lastName = lastName;

            /**
             * The email address of the user.
             * @property {string}
             */
            this.email = email;

            /**
             * The phone number of the user.
             * @property {string}
             */
            this.phone = phone;

            /**
             * The front-end URL associated with this user.
             * @property {string}
             */
            this.frontURL = frontURL;

            /**
             * Mark if the user's email is confirmed.
             * @property {string}
             */
            this.isEmailConfirmed = isEmailConfirmed;

            /**
             * The AuthBucket instance associated with this user.
             * @private
             * @property {AuthBucket}
             */
            this._auth = () => new AuthBucket(Object(auth), this);

            this.placeDefault();
        } catch(err) {
            /**
             * Thrown if there is an error during the User object construction.
             * @throws {Error.Log}
             */
            new Error.Log(err).append('common.model_construction', 'User');
        }
    }

    /**
     * Gets the full name of the user.
     * @returns {string} - The full name of the user.
     */
    get fullName() {
        return (this.firstName || '') + (this.lastName ? ' ' : '') + (this.lastName || '');
    }

    /**
     * Gets the AuthBucket instance associated with this user.
     * @returns {AuthBucket} - The AuthBucket instance.
     */
    get auth() {
        return this._auth();
    }

    /**
     * Gets the AuthService instance associated with this user.
     * @returns {AuthService} - The AuthService instance.
     */
    get authService() {
        return this.auth && this.auth.service;
    }

    /**
     * Gets the user token associated with this user.
     * @returns {string} - The user token.
     */
    get token() {
        return this.authService.createUserToken();
    }

    /**
     * Gets the session information for this user.
     * @returns {Object} - The user session information.
     */
    get userSession() {
        return sessionCLI[this._id];
    }

    /**
     * Gets the current user session.
     * @returns {Object} - The current user session information.
     */
    get currentUser() {
        return sessionCLI.currentUser;
    }

    /**
     * Static method to retrieve user session information.
     * @returns {Object} - The user session information.
     */
    static userSession() {
        return sessionCLI[this.currentUser()];
    }

    /**
     * Static method to retrieve the current user session information.
     * @returns {Object} - The current user session information.
     */
    static currentUser() {
        return sessionCLI.currentUser;
    }

    /**
     * Signs out the user.
     * @async
     * @returns {Promise} - A promise resolving to the sign-out status.
     * @throws {Error.Log} If there is an error during the sign-out process.
     */
    async signOut() {
        try {
            const signedOut = await this.authService.signOut(this.userSession.token);
            return signedOut;
        } catch (err) {
            /**
             * Thrown if there is an error during the sign-out process.
             * @throws {Error.Log}
             */
            throw new Error.Log(err);
        }
    }

    /**
     * To generate a confimation token to be used in a confirmation URL.
     * @returns {string} - The confirmation token.
     */
    generateConfirmationToken() {
        if (!this.isEmailConfirmed) {
            this.confirmationToken = this.authService.generateKey(this.authService.secretKey, this.authService.generateRandom(10));
            return this.confirmationToken.toString('hex');
        }
    }

    async sendResetPassEmail(req) {
        try {
            return await API.mailService.sendResetPassword(this.email, await this.genResetPassLink(req));
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async genResetPassLink(req) {
        const { headers, session } = Object(req);
        const feOrigin = headers.origin;
        const resetToken = await this.genResetPassToken(session.id, this.email);
        const url = new URL(feOrigin + '/dashboard/reset-password/create-new');

        url.searchParams.set('useremail', this.email);
        url.searchParams.set('resettoken', resetToken);

        return url.toString();
    }

    async genResetPassToken(sessionID) {
        return await this.authService.createResetToken(sessionID, this.email);
    }

    /**
     * Converts the user information to a session object.
     * @returns {Object} - The session object representing the user information.
     */
    toSession() {
        return {
            _id: this._id,
            index: this.index,
            firstName: this.firstName,
            lastName: this.lastName,
            fullName: this.fullName,
            email: this.email,
            userToken: this.token,
            isEmailConfirmed: this.isEmailConfirmed
        };
    }

    /**
     * Converts the user information to a public object, excluding sensitive data.
     * @param {Object} append - Additional data to append to the public object.
     * @returns {Object} - The public object representing the user information.
     */
    toPublic(append) {
        const dataOut = {...this, ...append};

        delete dataOut.auth;
        delete dataOut._schema;
        return dataOut;
    }

    /**
     * Static method to retrieve the current user's information.
     * @param {Object} filter - The filter object to use for user retrieval.
     * @returns {Promise<User>} - A promise resolving to the user object.
     * @throws {Error.Log} If there is an error during user retrieval.
     */
    static async getMyUser(filter) {
        try {
            const currentUser = filter || sessionCLI.currentUser || '';
            const userDOC = await this.getUser(currentUser);

            if (userDOC instanceof Error.Log) {
                throw userDOC;
            }

            return userDOC;
        } catch (err) {
            /**
             * Thrown if there is an error during user retrieval.
             * @throws {Error.Log}
             */
            throw new Error.Log(err);
        }
    }

    /**
     * Static method to retrieve user information based on the provided filter.
     * @param {Object} filter - The filter object to use for user retrieval.
     * @returns {Promise<User>} - A promise resolving to the user object.
     * @throws {Error.Log} If there is an error during user retrieval.
     */
    static async getUser(filter) {
        try {
            const userDOC = await CRUD.getDoc({ collectionName: 'users', filter }).defaultPopulate();

            if (!userDOC) {
                /**
                 * Thrown if the user is not found.
                 * @throws {Error.Log}
                 */
                return new Error.Log('user.not_found', filter);
            }

            return userDOC.initialize();
        } catch (err) {
            /**
             * Thrown if there is an error during user retrieval.
             * @throws {Error.Log}
             */
            throw new Error.Log(err);
        }
    }

    /**
     * Static method to check if a user with the given username exists.
     * @param {string} userName - The username to check for existence.
     * @param {boolean} returnUID - Indicates whether to return the user ID if the user exists.
     * @returns {Promise<boolean|string>} - A promise resolving to `true` if the user exists, or the user ID if `returnUID` is `true`.
     * @throws {Error.Log} If there is an error during the existence check.
     */
    static async isExist(email, returnUID) {
        try {
            const result = await dbHelpers.isDocExist('users', { email });
            if (result instanceof Error.Log) {
                throw result;
            }

            if (result) {
                if (returnUID) {
                    return result.toString();
                } else {
                    return true;
                }
            } else {
                return false;
            }
        } catch (err) {
            /**
             * Thrown if there is an error during the existence check.
             * @throws {Error.Log}
             */
            throw new Error.Log(err);
        }
    }

    /**
     * Static method to create a new user.
     * @param {Object} setup - The user setup object containing necessary details.
     * @param {Object} options - Additional options for user creation.
     * @param {boolean} options.confirmationEmail - Indicates whether to confirm the new user's email or not.
     * @returns {Promise} - A promise resolving to the user creation status.
     * @throws {Error.Log} If there is an error during user creation.
     */
    static async create(setup, options) {
        try {
            const { userName, email } = Object(setup);
            const { confirmationEmail } = Object(options);

            // Check if the userName or email (that can be a username) is already in use
            const isExist = await this.isExist(userName || email);
            // If the user is already in use, throw an error
            if (isExist) {
                return new Error.Log('auth.user_in_use');
            }

            const newUser = await CRUD.create('users', setup);
            if (newUser instanceof Error.Log) {
                throw newUser;
            }

            const user = newUser.initialize();
            if (confirmationEmail && API.mailService) {
                const confirmationToken = user.generateConfirmationToken();
                const emailLink = new URL('http://localhost:8080/dashboard/email-confirmation');

                emailLink.searchParams.set('confirmationtoken', confirmationToken.toString('hex'));
                await API.mailService.sendConfirmation(user.email, emailLink.toString());
            }

            return user;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    /**
     * Static method to sign in a user.
     * @param {string} userName - The username of the user to sign in.
     * @param {string} password - The user's password.
     * @returns {Promise<User|Error.Log>} - A promise resolving to the signed-in user object, or an error object if sign-in fails.
     * @throws {Error.Log} If there is an error during sign-in.
     */
    static async signIn(userName, password) {
        try {
            const userDOC = await CRUD.getDoc({ collectionName: 'users', filter: { userName }}).defaultPopulate();

            if (!userDOC) {
                return new Error.Log('auth.user_not_found', userName);
            }

            const user = userDOC.initialize();
            const signedIn = await user.authService.signIn(password);

            if (signedIn.success) {
                return user;
            } else {
                return signedIn;
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = User;
