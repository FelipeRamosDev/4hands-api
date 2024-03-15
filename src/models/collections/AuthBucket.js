const _Global = require('4hands-api/src/models/maps/_Global');
const AuthService = require('4hands-api/src/services/Auth');
const CRUD = require('4hands-api/src/services/database/crud');

/**
 * Represents an authentication bucket associated with a user.
 * @module AuthBucket
 * @extends _Global
 * @namespace Models
 */
class AuthBucket extends _Global {
    /**
     * Creates a new instance of the AuthBucket class.
     * @param {Object} setup - The setup object containing authentication details.
     * @param {string} setup.password - The hashed password associated with the user.
     * @param {Object} setup.user - The user object containing user-specific details.
     * @param {Object} parent - The parent object to which this AuthBucket belongs.
     * @throws {Error.Log} If setup parameters are missing or invalid.
     */
    constructor(setup, parent) {
        super(setup, parent);
        const { password, user } = Object(setup);
        const self = this;

        /**
         * The AuthService instance associated with this AuthBucket.
         * @property {AuthService}
         */
        this.service = new AuthService({ parent: self });

        /**
         * The hashed password associated with the user.
         * @property {string}
         */
        this.password = password;

        /**
         * The user object containing user-specific details.
         * @property {Object}
         */
        this.user = user ? user.oid(true) : {};
    }

    /**
     * Gets the username associated with this AuthBucket.
     * @returns {string} - The username.
     */
    get userName() {
        return this.parent.getSafe('userName');
    }
    
    /**
     * Gets the unique identifier of the user associated with this AuthBucket.
     * @returns {Object} - The user's unique identifier.
     */
    get userUID() {
        return this.user;
    }

    /**
     * Change the user's password.
     * @async
     * @param {string} newPassword The new password string. 
     * @returns {object} 
     */
    async changePassword(newPassword) {
        try {
            const updated = await this.updateDB({ data: { password: newPassword }});

            if (updated instanceof Error.Log) {
                throw updated;
            }

            return { success: true };
        } catch (err) {
            throw new Error.Log(err);
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
        try {
            const auth = await CRUD.create('auth_buckets', {
                user: user.id,
                rule: user.raw.rule,
                password: user.raw.password
            });

            if (auth instanceof Error.Log || !auth) {
                throw auth;
            }

            return auth;
        } catch (err) {
            /**
             * Thrown if there is an error during the AuthBucket creation process.
             * @throws {Error.Log}
             */
            throw new Error.Log(err);
        }
    }
}

module.exports = AuthBucket;
