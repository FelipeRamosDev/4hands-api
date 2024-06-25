class DataMessage {
    /**
     * Constructs a new DataMessage instance.
     * @param {Object} setup - The setup object.
     * @param {string} setup.target - The target path (default is '/').
     * @param {string} setup.from - The sender's identifier (required).
     * @param {Object} setup.data - The data payload (required).
     * @throws {Error} If 'setup.from' is not a string or is missing.
     * @throws {Error} If 'setup.data' is not a valid object.
     */
    constructor(setup) {
        const { target = '/', from, data } = Object(setup);

        if (!from || typeof from !== 'string') {
            throw new Error('The "setup.from" param is required and it needs to be a string!');
        }

        if (typeof data !== 'object' || Array.isArray(data) || data === null) {
            throw new Error('The "setup.data" param is required and it needs to be a valid object!');
        }

        this.target = target;
        this.from = from;
        this.data = data;
    }

    /**
     * Gets the target path as an array of strings.
     * @return {Array<string>} The target path split by '/'.
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
     * Parses the target path into an object with 'core' and 'thread'.
     * @return {Object} The parsed target path.
     * @return {string} return.core - The core part of the path.
     * @return {string} return.thread - The thread part of the path.
     */
    get parseStringPath() {
        if (this.target === '/') {
            return {};
        }

        const [ core, thread ] = this.targetArray;
        return { core, thread };
    }

    /**
     * Gets the core part of the target path.
     * @return {string} The core part of the path.
     */
    get targetCore() {
        const { core } = this.parseStringPath;
        return core;
    }

    /**
     * Gets the thread part of the target path.
     * @return {string} The thread part of the path.
     */
    get targetThread() {
        const { thread } = this.parseStringPath;
        return thread;
    }

    /**
     * Gets the output representation of the DataMessage instance.
     * @return {Object} The DataMessage instance properties.
     */
    get output() {
        return { ...this };
    }

    /**
     * Checks if the current core matches the target core.
     * @param {string} currentCore - The core to match against.
     * @return {boolean} True if the cores match, false otherwise.
     */
    isCoreMatch(currentCore) {
        return Boolean(this.targetCore === currentCore);
    }

    /**
     * Checks if the current path matches the target path.
     * @param {string} currentPath - The path to match against.
     * @return {boolean} True if the paths match, false otherwise.
     */
    isArrived(currentPath) {
        return Boolean(currentPath === this.target);
    }

    /**
     * Builds a new DataMessage instance from the given data.
     * @param {Object} data - The data to build the DataMessage from.
     * @return {DataMessage|undefined} The new DataMessage instance or undefined if data is invalid.
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
