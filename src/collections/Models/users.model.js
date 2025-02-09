const _Global = require('./_globals.model');
const AuthBucket = require('./auth_buckets.model');
const dbHelpers = require('../../helpers/database/dbHelpers');

class User extends _Global {
    constructor (setup, parent) {
        super(setup, parent);
    }

    /**
     * Gets the full name of the user.
     * @returns {string} - The full name of the user.
     */
    get fullName() {
        return (this.firstName || '') + (this.lastName ? ' ' : '') + (this.lastName || '');
    }

    /**
     * Gets the user token associated with this user.
     * @returns {string} - The user token.
     */
    get token() {
        return this.authService?.createUserToken();
    }

    /**
     * The Auth Service instance.
     * @returns {AuthService}
     */
    get authService() {
        return this.auth?.service;
    }

    /**
     * Signs up a new user.
     * @async
     * @returns {Promise<AuthBucket>} - A promise resolving to the auth bucket.
     * @throws {Error.Log} If there is an error during sign-up.
     */
    async signUp() {
        try {
            if (this.isNew) {
                const auth = await AuthBucket.draft(this);

                if (auth.error) {
                    throw auth;
                }

                if (auth) {
                    this.auth = auth;
                    return auth;
                }
            }
        } catch (err) {
            throw logError(err);
        }
    }
    
    /**
     * Generates a confirmation token to be used in a confirmation URL.
     * @returns {string} - The confirmation token.
     */
    generateConfirmationToken() {
        if (!this.isEmailConfirmed) {
            this.confirmationToken = this.authService.generateKey(this.authService.secretKey, this.authService.generateRandom(10));
            return this.confirmationToken.toString('hex');
        }
    }

    /**
     * Sends a reset password email to the user.
     * @async
     * @param {Object} req - The request object containing headers and session information.
     * @returns {Promise} - A promise resolving to the email sending status.
     * @throws {Error.Log} If there is an error during email sending.
     */
    async sendResetPassEmail(req) {
        const API = global._4handsAPI?.API;

        try {
            return await API.mailService.sendResetPassword(this.email, await this.genResetPassLink(req));
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Generates a session token for the user.
     * @async
     * @param {Object} session - The session object.
     * @returns {Promise<string>} - A promise resolving to the session token.
     * @throws {Error.Log} If there is an error during token generation.
     */
    async sessionToken(session) {
        return await this.authService.createSessionToken(session);
    }

    /**
     * Generates a reset password link for the user.
     * @async
     * @param {Object} req - The request object containing headers and session information.
     * @returns {Promise<string>} - A promise resolving to the reset password link.
     * @throws {Error.Log} If there is an error during link generation.
     */
    async genResetPassLink(req) {
        const { headers, session } = Object(req);
        const feOrigin = headers.origin;
        const resetToken = await this.genResetPassToken(session.id);
        const url = new URL(feOrigin + '/dashboard/reset-password');

        url.searchParams.set('useremail', this.email);
        url.searchParams.set('resettoken', resetToken);

        return url.toString();
    }

    /**
     * Generates a reset password token for the user.
     * @async
     * @param {string} sessionID - The session ID.
     * @returns {Promise<string>} - A promise resolving to the reset password token.
     * @throws {Error.Log} If there is an error during token generation.
     */
    async genResetPassToken(sessionID) {
        return this.authService.createResetToken(sessionID, this.email);
    }

    /**
     * Signs out the user.
     * @async
     * @returns {Promise<boolean>} - A promise resolving to the sign-out status.
     * @throws {Error.Log} If there is an error during the sign-out process.
     */
    async signOut() {
        try {
            const signedOut = await this.authService.signOut(this.userSession.token);
            return signedOut;
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Converts the user information to a session object.
     * @async
     * @param {Object} session - The session object.
     * @returns {Promise<Object>} - A promise resolving to the session object.
     * @throws {Error.Log} If there is an error during conversion.
     */
    async toSession(session) {
        return {
            _id: this._id,
            index: this.index,
            firstName: this.firstName,
            lastName: this.lastName,
            fullName: this.fullName,
            email: this.email,
            token: await this.sessionToken(session),
            rules: this.rules,
            userInstance: this.userInstance
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
     * Sends a confirmation email to the user's email.
     * @async
     * @returns {Promise<Object>} - A promise resolving to the email sending status.
     * @throws {Error.Log} If there is an error during email sending.
     */
    async sendConfirmationEmail() {
        const API = global._4handsAPI?.API;

        try {
            if (API.FE_ORIGIN && API.mailService) {
                const confirmationToken = this.generateConfirmationToken();
                const emailLink = new URL(API.FE_ORIGIN + '/dashboard/email-confirmation');
                const confirmationTokenString = confirmationToken.toString('hex');

                emailLink.searchParams.set('confirmationtoken', confirmationTokenString);

                const emailSent = await API.mailService.sendConfirmation(this.email, emailLink.toString(), {
                    projectLogoURL: API.FE_ORIGIN + '/images/candlepilot_logo.png'
                });

                emailSent.confirmationToken = confirmationTokenString;
                return emailSent;
            }
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Retrieves user information based on the provided filter.
     * @static
     * @async
     * @param {Object} filter - The filter object to use for user retrieval.
     * @returns {Promise<User>} - A promise resolving to the user object.
     * @throws {Error.Log} If there is an error during user retrieval.
     */
    static async getUser(filter) {
        const CRUD = global._4handsAPI?.CRUD;

        try {
            const userDOC = await CRUD.getDoc({collectionName: 'users', filter}).defaultPopulate();

            if (!userDOC) {
                return;
            }

            const initialized = userDOC.initialize();
            return initialized;
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Retrieves a cached user document based on the user ID.
     * @static
     * @async
     * @param {string} uid - The user ID.
     * @returns {Promise<User>} - A promise resolving to the cached user document.
     */
    static async getDocCache(uid) {
        return getCacheModel('users', uid, User);
    }

    /**
     * Checks if a user with the given email exists.
     * @static
     * @async
     * @param {string} email - The email to check for existence.
     * @param {boolean} returnUID - Indicates whether to return the user ID if the user exists.
     * @returns {Promise<boolean|string>} - A promise resolving to `true` if the user exists, or the user ID if `returnUID` is `true`.
     * @throws {Error.Log} If there is an error during the existence check.
     */
    static async isExist(email, returnUID) {
        try {
            const result = await dbHelpers.isDocExist('users', { email });
            if (result?.error) {
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
            throw logError(err);
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
        const API = global._4handsAPI?.API;
        const CRUD = global._4handsAPI?.CRUD;

        try {
            const { userName, email } = Object(setup);
            const { confirmationEmail } = Object(options);

            // Check if the userName or email (that can be a username) is already in use
            const isExist = await this.isExist(userName || email);
            // If the user is already in use, throw an error
            if (isExist) {
                return logError({
                    name: 'USERNAME_ALREADY_USED',
                    message: `The user name "${userName || email}" is already in use!`
                });
            }

            const newUser = await CRUD.create('users', setup);
            if (newUser.error) {
                throw newUser;
            }

            const user = await newUser.loadDB();
            if (confirmationEmail && API.mailService) {
                await user.sendConfirmationEmail();
            }

            return user;
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Static method to sign in a user.
     * @param {string} userName - The username of the user to sign in.
     * @param {string} password - The user's password.
     * @returns {Promise<User|Error>} - A promise resolving to the signed-in user object, or an error object if sign-in fails.
     * @throws {Error.Log} If there is an error during sign-in.
     */
     static async signIn(userName, password) {
        const CRUD = global._4handsAPI?.CRUD;

        try {
            const userDOC = await CRUD.getDoc({ collectionName: 'users', filter: { email: userName }}).defaultPopulate();

            if (!userDOC) {
                return logError({
                    name: 'USER_NOT_FOUND',
                    message: `The user "${userName}" does not exist!`
                });
            }

            const user = userDOC.initialize();
            const signedIn = await user.authService.signIn(password);

            if (signedIn.success) {
                return user;
            } else {
                return signedIn;
            }
        } catch (err) {
            throw logError(err);
        }
    }
}

module.exports = User;
