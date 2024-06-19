/**
 * Represents a message containing data to be sent across threads or cores.
 */
class DataMessage {
    /**
     * Creates an instance of DataMessage.
     * @param {Object} setup - The setup object for the DataMessage.
     * @param {string} setup.target - The target path for the message.
     * @param {string} [setup.route] - The route path for the message.
     * @param {string} setup.from - The origin path of the message.
     * @param {Object} setup.data - The data to be sent with the message.
     */
    constructor(setup) {
        const { target = '/', route, from, data } = Object(setup);

        if (!from || typeof from !== 'string') {
            throw new Error('The "setup.from" param is required and it needs to be a string!');
        }

        if (typeof data !== 'object' || Array.isArray(data) || data === null) {
            throw new Error('The "setup.data" param is required and it needs to be a valid object!');
        }

        this.target = target;
        this.route = route;
        this.from = from;
        this.data = data;

        if (this.target === '/') {
            this.isToMaster = true
        }
    }

    /**
     * Parses the target string into an array of its components.
     * @returns {string[]} An array representing the parsed target path.
     */
    get targetArray() {
        if (this.target === '/') {
            return [];
        }

        const firstTargetChar = this.target[0];
        const parsedString = (firstTargetChar === '/') ? this.target.replace('/', '') : this.target;
        return parsedString.split('/');
    }

    /**
     * Parses the target string into an object with 'core' and 'thread' properties.
     * @returns {Object} An object representing the parsed target path.
     */
    get parseStringPath() {
        if (this.target === '/') {
            return {};
        }

        const [ core, thread ] = this.targetArray;
        return { core, thread };
    }

    /**
     * Retrieves the core part of the target path.
     * @returns {string} The core part of the target path.
     */
    get targetCore() {
        const { core } = this.parseStringPath;
        return core;
    }

    /**
     * Retrieves the thread part of the target path.
     * @returns {string} The thread part of the target path.
     */
    get targetThread() {
        const { thread } = this.parseStringPath;
        return thread;
    }

    /**
     * Converts this DataMessage instance to a plain object.
     * @returns {Object} A plain object representation of this DataMessage instance.
     */
    toObject() {
        return { ...this };
    }

    /**
     * Checks if this message's target core matches a given core name.
     * @param {string} currentCore - The name of the core to check against this message's target core.
     * @returns {boolean} True if there is a match, false otherwise.
     */
    isCoreMatch(currentCore) {
        return Boolean(this.targetCore === currentCore);
    }

    /**
     * Checks if this message has arrived at its intended target path.
     * @param {string} currentPath - The current path to check against this message's target path.
     * @returns {boolean} True if it has arrived, false otherwise.
     */
    isArrived(currentPath) {
        return Boolean(currentPath === this.target);
    }

    /**
     * Attempts to build a new DataMessage instance from a given data object. Returns undefined if unsuccessful.
     * @param {Object} data - The data object to use for building a new DataMessage instance.
     * @returns {DataMessage|undefined} A new DataMessage instance or undefined if building was unsuccessful.
     */
    static build(data) {
        if (typeof data !== 'object' || Array.isArray(data) || data === null) {
            return;
        }

        try {
            const dataMessage = new DataMessage(data);
            return dataMessage;
        } catch (err) {
            return;
        }
    }
}

module.exports = DataMessage;
