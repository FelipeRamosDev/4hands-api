const _Global = require('4hands-api/src/collections/Models/_globals.model');
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

    get authService() {
        return this.auth?.service;
    }

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
        const API = global._4handsAPI?.API;

        try {
            return await API.mailService.sendResetPassword(this.email, await this.genResetPassLink(req));
        } catch (err) {
            throw logError(err);
        }
    }

    async sessionToken(session) {
        return await this.authService.createSessionToken(session);
    }

    async genResetPassLink(req) {
        const { headers, session } = Object(req);
        const feOrigin = headers.origin;
        const resetToken = await this.genResetPassToken(session.id);
        const url = new URL(feOrigin + '/dashboard/reset-password/create-new');

        url.searchParams.set('useremail', this.email);
        url.searchParams.set('resettoken', resetToken);

        return url.toString();
    }

    async genResetPassToken(sessionID) {
        return this.authService.createResetToken(sessionID, this.email);
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
            throw logError(err);
        }
    }

    /**
     * Converts the user information to a session object.
     * @returns {Object} - The session object representing the user information.
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
        const dataOut = {...this.toObject(), ...append};

        delete dataOut.auth;
        delete dataOut._schema;
        return dataOut;
    }

    /**
     * Sends a confirmation e-mail to user's e-mail.
     * @returns {object}
     */
    async sendConfirmationEmail() {
        const API = global._4handsAPI?.API;

        try {
            if (API.FE_ORIGIN && API.mailService) {
                const confirmationToken = this.generateConfirmationToken();
                const emailLink = new URL(API.FE_ORIGIN + '/dashboard/email-confirmation');
                const confirmationTokenString = confirmationToken.toString('hex');

                emailLink.searchParams.set('confirmationtoken', confirmationTokenString);

                const emailSent = await API.mailService.sendConfirmation(this.email, emailLink.toString());
                emailSent.confirmationToken = confirmationTokenString;
                return emailSent;
            }
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Static method to retrieve user information based on the provided filter.
     * @param {Object} filter - The filter object to use for user retrieval.
     * @returns {Promise<User>} - A promise resolving to the user object.
     * @throws {Error.Log} If there is an error during user retrieval.
     */
    static async getUser(filter) {
        const CRUD = global._4handsAPI?.CRUD;

        try {
            const userDOC = await CRUD.getDoc({collectionName: 'users', filter}).defaultPopulate();

            if (!userDOC) {
                return logError('user.not_found', filter);
            }

            const initialized = userDOC.initialize();
            if (!initialized.gitHub && initialized.auth.gitHubToken) {
                await initialized.updateDB({data: {
                    gitHub: await initialized.loadGitHubData()
                }});
            } 

            return initialized;
        } catch (err) {
            throw logError(err);
        }
    }

    static async getDocCache(uid) {
        return getCacheModel('users', uid, User);
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
                return logError('auth.user_in_use');
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
     static async signIn(userName, password, preventEmailConfirm) {
        const CRUD = global._4handsAPI?.CRUD;

        try {
            const userDOC = await CRUD.getDoc({ collectionName: 'users', filter: { email: userName }}).defaultPopulate();

            if (!userDOC) {
                return logError('auth.user_not_found', userName);
            }

            if (!preventEmailConfirm && !userDOC.isEmailConfirmed) {
                return logError({
                    code: 401,
                    name: 'USER_EMAIL_NOT_CONFIRMED',
                    message: `The user needs to confirm his email before login!`
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
