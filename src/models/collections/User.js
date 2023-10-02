const _Global = require('../maps/_Global');
const AuthBucket = require('./AuthBucket');
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
            phone
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
            this.displayName = `${firstName} ${lastName} (${email})`;

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
            jira: this.jira,
            userToken: this.token,
            gitHubToken: this.auth.gitHubToken,
            gitHubUser: this.auth.gitHubUser,
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
        delete dataOut.gitHubConnection;
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
            const userDOC = await CRUD.getDoc({collectionName: 'users', filter}).defaultPopulate();

            if (!userDOC) {
                /**
                 * Thrown if the user is not found.
                 * @throws {Error.Log}
                 */
                return new Error.Log('user.not_found', filter);
            }

            const initialized = userDOC.initialize();
            if (!initialized.gitHub && initialized.auth.gitHubToken) {
                await initialized.updateDB({data: {
                    gitHub: await initialized.loadGitHubData()
                }});
            } 

            return initialized;
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
    static async isExist(userName, returnUID) {
        try {
            const result = await dbHelpers.isDocExist('users', { userName });
            if (result instanceof Error.Log) {
                throw result;
            }

            if (result && result._id.oid()) {
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
     * @param {boolean} options.preventSignIn - Indicates whether to prevent automatic sign-in after user creation.
     * @returns {Promise} - A promise resolving to the user creation status.
     * @throws {Error.Log} If there is an error during user creation.
     */
    static async create(setup, options) {
        try {
            const { userName, email, password } = Object(setup);
            const { preventSignIn } = Object(options);

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

            return Object().toSuccess();
        } catch (err) {
            /**
             * Thrown if there is an error during user creation.
             * @throws {Error.Log}
             */
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
                /**
                 * Thrown if the user is not found during sign-in.
                 * @throws {Error.Log}
                 */
                return new Error.Log('auth.user_not_found', userName);
            }

            const user = userDOC.initialize();
            const signedIn = await user.authService.signIn(password);

            if (signedIn.success) {
                return user;
            } else {
                /**
                 * Thrown if there is an error during sign-in.
                 * @throws {Error.Log}
                 */
                return signedIn;
            }
        } catch (err) {
            /**
             * Thrown if there is an error during sign-in.
             * @throws {Error.Log}
             */
            throw new Error.Log(err);
        }
    }
}

module.exports = User;
