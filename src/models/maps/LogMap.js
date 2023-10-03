/**
 * Represents a base class for logging in the application.
 * @module LogBase
 * @namespace Models
 */
class LogBase {
    /**
     * Creates a new instance of the LogBase class.
     * @param {Object} params - The parameters for the log.
     * @param {string} params.status - The status of the log.
     * @param {string} params.type - The type of the log (default is 'log').
     * @param {string} params.name - The name of the log.
     * @param {string} params.message - The message of the log.
     * @param {string} params.resource - The resource associated with the log.
     */
    constructor({
        status,
        type,
        name,
        message,
        resource
    }) {
        this.status = status;
        this.type = type || 'log';
        this.name = name;
        this.message = message;
        this.resource = resource;
    }

    /**
     * Converts the log object to its JSON representation.
     * @returns {string} - The JSON representation of the log object.
     * @throws {Error} If there is an error during JSON stringification.
     */
    toJSON() {
        try {
            return JSON.stringify({...this});
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    /**
     * Notifies relevant parties about the log.
     * @abstract
     */
    notify() {
        // To be implemented by subclasses.
    }

    /**
     * Sends email notifications about the log.
     * @abstract
     */
    emailNotify() {
        // To be implemented by subclasses.
    }
}

module.exports = LogBase;
