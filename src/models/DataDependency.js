const CRUD = require('@CRUD');

/**
 * Represents a data dependency used to manage real-time data updates and rendering in a parent component.
 */
class DataDependency {
    /**
     * Constructs a DataDependency instance.
     * @param {Object} setup - The setup object containing name, type, collectionName, and filter properties.
     * @param {Object} parent - The parent component associated with this data dependency.
     * @throws {Error} - Throws an error if the setup object is not valid.
     */
    constructor(setup, parent) {
        try {
            const { name, type, collectionName, filter } = Object(setup);

            this.name = name;
            this.type = type;
            this.collectionName = collectionName;
            this.filter = filter;

            /**
             * Private function to access the parent component associated with this data dependency.
             * @private
             * @returns {Object} - The parent component object.
             */
            this._parent = () => parent;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    /**
     * Gets the parent component associated with this data dependency.
     * @returns {Object} - The parent component object.
     */
    get parent() {
        return this._parent();
    }

    /**
     * Adds a socket update listener for real-time data updates.
     * @param {Object} socketConnection - The socket connection object.
     * @param {string} subsUID - The unique identifier for the subscription.
     */
    addSocketUpdateListener(socketConnection, subsUID) {
        const self = this;
        process.on(`socket:update:${this.collectionName}:${JSON.stringify(this.filter)}`, (ev) => self.updateComponentHandler.call(this, ev, socketConnection, subsUID));
    }
    
    /**
     * Handles real-time component updates and emits the updated component data to the client.
     * @param {Object} ev - The event object containing update information.
     * @param {Object} socketConnection - The socket connection object.
     * @param {string} subsUID - The unique identifier for the subscription.
     * @throws {Error} - Throws an error if an update operation fails.
     */
    async updateComponentHandler(ev, socketConnection, subsUID) {
        try {
            const newValue = await this.load();
            this.parent.updateMerge({[this.name]: newValue});

            const htmlString = this.parent.renderToString();
            socketConnection.socket.emit('subscribe:component:data:' + subsUID, htmlString.toSuccess());
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    /**
     * Loads data based on the data dependency type (doc or list).
     * @returns {Object|Array} - The loaded data object or array.
     * @throws {Error} - Throws an error if the data loading fails.
     */
    async load() {
        try {
            if (this.type === 'doc') {
                const docQuery = await CRUD.getDoc({ collectionName: this.collectionName, filter: this.filter }).defaultPopulate();

                if (docQuery instanceof Error.Log) {
                    return docQuery;
                }

                this.value = docQuery.initialize();
                return this.value;
            }

            if (this.type === 'list') {
                const queryList = await CRUD.query({ collectionName: this.collectionName, filter: this.filter }).defaultPopulate();

                if (queryList instanceof Error.Log || !Array.isArray(queryList)) {
                    return queryList;
                }

                this.value = queryList.map(item => item.initialize());
                return this.value;
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = DataDependency;
