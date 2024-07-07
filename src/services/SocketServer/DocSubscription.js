/**
 * Represents a subscription for a specific document in a collection.
 * Extends SocketSubscription class.
 */
class DocSubscription extends SocketSubscription {
    /**
     * Creates an instance of DocSubscription.
     * @param {Object} setup - Configuration options for the subscription.
     * @param {Object} connection - The connection object for managing the subscription.
     * @param {Object} setup.doc - The document object associated with the subscription.
     * @param {string} setup.collectionName - The name of the collection to which the document belongs.
     * @param {Object} setup.filter - The filter object used to query the document from the collection.
     */
    constructor(setup, connection) {
        super(setup, connection);

        try {
            const { doc, collectionName, filter } = Object(setup);

            /**
             * Type identifier for the subscription (document).
             * @type {string}
             */
            this.type = 'doc';

            /**
             * The document object associated with the subscription.
             * @type {Object}
             */
            this.doc = doc;

            /**
             * The name of the collection to which the document belongs.
             * @type {string}
             */
            this.collectionName = collectionName;

            /**
             * The filter object used to query the document from the collection.
             * @type {Object}
             */
            this.filter = filter;
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Triggers the subscription and sends the document data to the client.
     * @returns {Object} - The document object if found, or an error object if not found.
     */
    async trigger() {
        try {
            const doc = await this.handler();

            if (!doc) {
                this.socket.emit('subscribe:doc:null', logError({
                    name: 'NOT_FOUND',
                    message: `The document requested wasn't found!`
                }));
            }

            this.socket.emit('subscribe:doc:data', doc);
            return doc.toSuccess();
        } catch (err) {
            this.socket.emit('subscribe:doc:error', logError(err));
        }
    }

    /**
     * Handles the document subscription request by querying the database and initializing the document object.
     * @returns {Object} - The initialized document object.
     * @throws Will throw an error if the document retrieval or initialization fails.
     */
    async handler() {
        const CRUD = global._4handsAPI?.CRUD;
        const { collectionName, filter } = Object(this);

        try {
            // Retrieves the document from the specified collection and applies default population.
            const docQuery = await CRUD.getDoc({ collectionName, filter }).defaultPopulate();

            // Initializes the document object.
            const doc = docQuery.initialize();

            // Updates the subscription's doc property.
            this.doc = doc;

            return doc;
        } catch (err) {
            throw logError(err);
        }
    }
}

module.exports = DocSubscription;
