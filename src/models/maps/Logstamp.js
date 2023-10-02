/**
 * Represents a log entry with a timestamp, activity type, and description.
 * @module Logstamp
 * @namespace Models
 */
class Logstamp {
    /**
     * Creates a new instance of the Logstamp class.
     * @param {Object} setup - The setup object.
     * @param {string} setup.timestamp - The timestamp of the log entry.
     * @param {string} setup.activityType - The type of activity associated with the log entry.
     * @param {string} setup.activityDescription - The description of the activity in the log entry.
     */
    constructor(setup) {
        try {
            const { timestamp, activityType, activityDescription } = Object(setup);

            /**
             * The timestamp of the log entry.
             * @type {string}
             */
            this.timestamp = timestamp;

            /**
             * The type of activity associated with the log entry.
             * @type {string}
             */
            this.activityType = activityType;

            /**
             * The description of the activity in the log entry.
             * @type {string}
             */
            this.activityDescription = activityDescription;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Logstamp;
