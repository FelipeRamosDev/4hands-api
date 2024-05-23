const crypto = require('crypto');
const CRUD = require('4hands-api/src/services/database/crud');

/**
 * Class representing a SubscriptionIO for managing query and document subscriptions.
 *
 * @class
 */
class SubscriptionIO {
    /**
     * Create a SubscriptionIO instance.
     *
     * @constructor
     * @param {Object} setup - Configuration object for the subscription.
     * @param {Object} subscriber - The subscriber instance managing this subscription.
     * @throws {Error} - Throws an error if the type or collection is missing.
     */
    constructor(setup, subscriber) {
        const { socketID, type, loadMethod, collection, docUID, filter, options } = Object(setup);

        if (!type || !collection) {
            throw logError('common.missing_params');
        }

        this._subscriber = () => subscriber;
        this.id = crypto.randomUUID();
        this.socketID = socketID;
        this.type = type;
        this.loadMethod = loadMethod;
        this.collection = collection;

        if (type === 'query') {
            this.filter = filter;
            this.options = options;

            this.loadQuery();
        }

        if (type === 'doc') {
            this.docUID = docUID;
            this.loadDoc();
        }
    }

    /**
     * Get the subscriber instance.
     *
     * @returns {Object} - The subscriber instance.
     */
    get subscriber() {
        return this._subscriber();
    }

    /**
     * Get custom load queries from the subscriber.
     *
     * @returns {Object} - Custom load queries.
     */
    get customLoadQueries() {
        return this.subscriber?.customLoadQueries;
    }

    /**
     * Get custom load documents from the subscriber.
     *
     * @returns {Object} - Custom load documents.
     */
    get customLoadDocs() {
        return this.subscriber?.customLoadDocs;
    }

    /**
     * Get the custom load method for the subscription.
     *
     * @returns {Function} - The custom load method.
     */
    get customLoadMethod() {
        let loadMethod;
        
        if (this.type === 'query') {
            if (!this.customLoadQueries) {
                return;
            }

            loadMethod = this.customLoadQueries[this.loadMethod];
        }
        
        if (this.type === 'doc') {
            if (!this.customLoadDocs) {
                return;
            }

            loadMethod = this.customLoadDocs[this.loadMethod];
        }

        if (typeof loadMethod === 'function') {
            return loadMethod;
        }
    }

    /**
     * Send a snapshot of data to the client.
     *
     * @param {Object} data - The data to send as a snapshot.
     */
    sendSnapshot(data) {
        const socket = this.subscriber.getConnection(this.socketID);

        if (socket) {
            socket.emit(this.id, data);
        }
    }

    /**
     * Load query data based on the filter and options.
     *
     * @async
     * @param {boolean} [jumpCustom=false] - Whether to skip the custom load method.
     * @param {boolean} [preventSnapshot=false] - Whether to prevent sending a snapshot.
     * @returns {Promise<Object[]>} - The loaded query data.
     * @throws {Error} - Throws an error if the loading operation fails.
     */
    async loadQuery(jumpCustom = false, preventSnapshot = false) {
        if (!jumpCustom && this.customLoadMethod) {
            return this.customLoadMethod();
        }

        try {
            const { sort, limit, page } = Object(this.options);
            const toLoad = CRUD.query({
                collectionName: this.collection,
                filter: this.filter,
                sort,
                limit,
                page
            });

            const loaded = toLoad.defaultPopulate ? await toLoad.defaultPopulate() : await toLoad.exec();
            if (!loaded || loaded?.error) {
                this.subscriber.closeSubscription(this.socketID);
                throw toError(loaded);
            }

            this.uidString = loaded.map(item => item.id).join('');
            this.lastQueryLoaded = loaded;

            // Sending to FE side
            if (!preventSnapshot) {
                this.sendSnapshot(loaded);
            }

            return loaded;
        } catch (err) {
            throw toError(err);
        }
    }

    /**
     * Load a document based on the filter or document UID.
     *
     * @async
     * @param {boolean} [jumpCustom=false] - Whether to skip the custom load method.
     * @param {boolean} [preventSnapshot=false] - Whether to prevent sending a snapshot.
     * @returns {Promise<Object>} - The loaded document.
     * @throws {Error} - Throws an error if the loading operation fails.
     */
    async loadDoc(jumpCustom = false, preventSnapshot = false) {
        if (!jumpCustom && this.customLoadMethod) {
            return this.customLoadMethod();
        }

        try {
            const toLoad = CRUD.getDoc({
                collectionName: this.collection,
                filter: this.filter || this.docUID
            });

            const doc = toLoad.defaultPopulate ? await toLoad.defaultPopulate() : await toLoad.exec();
            if (!doc) {
                return this.subscriber.closeSubscription(this.socketID);
            }

            if (doc.error) {
                this.subscriber.closeSubscription(this.socketID);
                throw toError(doc);
            }

            this.docUID = doc.id;
            this.lastDocLoaded = doc;

            if (!preventSnapshot) {
                this.sendSnapshot(doc);
            }

            return doc;
        } catch (err) {
            throw toError(err);
        }
    }

    /**
     * Execute actions based on the event type and document snapshot.
     *
     * @async
     * @param {string} eventType - The type of event (e.g., 'save', 'update').
     * @param {Object} docSnapshot - The document snapshot.
     * @returns {Promise<void>} - Resolves when the operation is complete.
     * @throws {Error} - Throws an error if the operation fails.
     */
    async exec(eventType, docSnapshot) {
        const { id } = Object(docSnapshot);
        const sortOpt = this.options?.sort;
        const limitOpt = this.options?.limit;
        const sortOptKeys = sortOpt && Object.keys(sortOpt);
        const hasSortOpt = sortOptKeys?.length;

        switch (eventType) {
            case 'save': {
                if (this.type === 'query') {
                    const isMatch = await CRUD.getDoc({
                        collectionName: this.collection,
                        filter: { _id: id, ...Object(this.filter) }
                    });

                    if (isMatch) {
                        this.lastQueryLoaded.push(isMatch);

                        if (hasSortOpt) {
                            const key = sortOptKeys[0];

                            this.lastQueryLoaded = this.lastQueryLoaded.sort((a, b) => {
                                if (sortOpt[key] === -1) {
                                    return b[key] - a[key];
                                } else {
                                    return a[key] - b[key];
                                }
                            });
                        }

                        if (limitOpt) {
                            this.lastQueryLoaded = this.lastQueryLoaded.splice(0, limitOpt);
                        }

                        this.sendSnapshot(this.lastQueryLoaded);
                    }

                    return;
                }
            }
            case 'update': {
                if (this.type === 'query') {
                    if (this.uidString && this.uidString.indexOf(id) > -1) {
                        // Updating the changed document
                        this.lastQueryLoaded = this.lastQueryLoaded.map((item, i) => {
                            if (item.id === docSnapshot._id) {
                                item = docSnapshot;
                            }

                            return item;
                        });

                        this.sendSnapshot(this.lastQueryLoaded);
                    }
                }

                if (this.type === 'doc') {
                    this.lastDocLoaded = docSnapshot;
                    this.sendSnapshot(docSnapshot);
                }

                return;
            }
        }
    }

    /**
     * Terminate the subscription.
     *
     * @returns {void} - Closes the subscription.
     */
    terminate() {
        return this.subscriber.closeSubscription(this);
    }
}

module.exports = SubscriptionIO;
