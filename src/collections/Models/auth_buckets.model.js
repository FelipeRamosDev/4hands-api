const AuthService = require('4hands-api/src/services/Auth');
const _Global = require('4hands-api/src/collections/Models/_globals.model');

class AuthBucket extends _Global {
    constructor (setup, parent) {
        super(setup, parent);

        const { password, user } = Object(setup);

        /**
         * The hashed password associated with the user.
         * @property {string}
         */
        this.password = password;

        /**
         * The user object containing user-specific details.
         * @property {Object}
         */
        this.user = user;
    }

    /**
     * The AuthService instance associated with this AuthBucket.
     * @property {AuthService}
     */
    get service() {
        return new AuthService({ parent: this });
    }

    /**
     * Gets the username associated with this AuthBucket.
     * @returns {string} - The username.
     */
    get userName() {
        return this?.user?.email;
    }
    
    /**
     * Gets the unique identifier of the user associated with this AuthBucket.
     * @returns {Object} - The user's unique identifier.
     */
    get userUID() {
        return this?.user?.UID;
    }
 
    async changePassword(newPassword) {
        try {
            await this.updateDB({ data: { password: newPassword }});
            return { success: true };
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Creates a draft AuthBucket for the given user.
     * @static
     * @async
     * @param {Object} user - The user object containing necessary details.
     * @returns {Promise<AuthBucket>} - The created AuthBucket instance.
     * @throws {Error.Log} If there is an error during the AuthBucket creation process.
     */
    static async draft(user) {
        const CRUD = global._4handsAPI?.CRUD;

        try {
            const auth = await CRUD.create('auth_buckets', {
                user: user.id,
                password: user.raw.password
            });

            if (auth.error || !auth) {
                throw auth;
            }

            return auth;
        } catch (err) {
            /**
             * Thrown if there is an error during the AuthBucket creation process.
             * @throws {Error.Log}
             */
            throw logError(err);
        }
    }
}

module.exports = AuthBucket;
