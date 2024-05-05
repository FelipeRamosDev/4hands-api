/**
 * Represents a success response object used to convey successful API responses.
 * @module Success
 * @namespace Models
 */
class Success {
    /**
     * Creates a new instance of the Success class.
     * @param {Object} data - The data object to be included in the response.
     * @param {string} message - The success message to be included in the response.
     */
    constructor(data, message) {
        /**
         * A flag indicating the success of the API response.
         * @property {boolean}
         */
        this.success = true;

        /**
         * The data object included in the response.
         * @property {Object}
         */
        this.data = data;

        /**
         * The success message included in the response.
         * @property {string}
         */
        this.message = message;
    }

    /**
     * Converts the Success object to a JSON string.
     * @method
     * @returns {string} - The JSON representation of the Success object.
     * @throws {Error} - Throws an error if JSON stringification fails.
     */
    toJSON() {
        try {
            return JSON.stringify({ ...this });
        } catch (err) {
            /**
             * Thrown if JSON stringification fails.
             * @throws {Error.Log}
             */
            throw logError(err);
        }
    }
}

module.exports = Success;
