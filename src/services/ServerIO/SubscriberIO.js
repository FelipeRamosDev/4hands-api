const ServerIO = require('./index');
const SubscriptionIO = require('./SubscriptionIO');

/**
 * Class representing a SubscriberIO that is used to create sockets namespace focus on DB documents changes watch extends ServerIO to manage subscriptions.
 * 
 * @class
 * @extends ServerIO
 */
class SubscriberIO extends ServerIO {
    /**
     * Create a SubscriberIO instance.
     *
     * @constructor
     * @param {Object} setup - Configuration object for the SubscriberIO.
     * @param {Function} setup.onCreate - Configuration object for the SubscriberIO.
     * @param {Function} setup.onUpdate - Configuration object for the SubscriberIO.
     * @param {Function} setup.onDelete - Configuration object for the SubscriberIO.
     * @param {Function} setup.onSubscribe - Configuration object for the SubscriberIO.
     * @param {Function} setup.customLoadDocs - Configuration object for the SubscriberIO.
     * @param {Function} setup.customLoadQueries - Configuration object for the SubscriberIO.
     * @param {string} setup.eventNamePrefix - Configuration object for the SubscriberIO.
     * @param {Object} serverIO - The ServerIO instance to extend.
     */
    constructor(setup, serverIO) {
        super(setup, serverIO);
        const {
            onCreate,
            onUpdate,
            onDelete,
            customLoadDocs,
            customLoadQueries,
            onSubscribe = () => {},
            eventNamePrefix = 'subscribe'
        } = Object(setup);

        this.isSubscriber = true;
        this.eventNamePrefix = eventNamePrefix;
        this.customLoadQueries = customLoadQueries;
        this.customLoadDocs = customLoadDocs;

        this.subscriptions = {
            query: {
                // chat_messages: [SubscriptionIO, SubscriptionIO]
            },
            doc: {
                // 'dOcUiDdOcUiDdOcUiDdOcUiD': [SubscriptionIO, SubscriptionIO]
            }
        };

        this.io.on('connect', (socket) => {
            socket.on('subscribe', (setup, callback) => {
                onSubscribe.call(this, socket, setup, callback);
            });
        });

        if (typeof onCreate === 'function') {
            this.onCreate = onCreate;
            process.on(this.getEventName('save'), onCreate.bind(this));
        }

        if (typeof onUpdate === 'function') {
            this.onUpdate = onUpdate;

            process.on(this.getEventName('update'), (...args) => {
                const [ collection ] = args;

                if (!collection || collection === 'counter') {
                    return;
                }

                onUpdate.call(this, ...args);
            });
        }

        if (typeof onDelete === 'function') {
            this.onDelete = onDelete;
            process.on(this.getEventName('delete'), onDelete.bind(this));
        }
    }

    /**
     * Generate an event name with the provided event type.
     *
     * @param {string} eventType - The type of event (e.g., 'save', 'update', 'delete').
     * @returns {string} - The formatted event name.
     */
    getEventName(eventType) {
        let prefix = this.eventNamePrefix;

        if ((prefix[prefix.length - 1] !== ':') && eventType) {
            prefix += ':';
        }

        return `${prefix}${eventType || ''}`;
    }

    /**
     * Subscribe to a query in a specific collection with a filter and options.
     *
     * @param {string} socketID - The socket ID associated with the subscription.
     * @param {string} collection - The collection to subscribe to.
     * @param {Object} filter - The filter criteria for the subscription.
     * @param {Object} options - Additional options for the subscription.
     * @returns {SubscriptionIO} - The created SubscriptionIO instance.
     */
    subscribeQuery(socketID, collection, filter, options) {
        const { loadMethod } = Object(options);
        const subscription = new SubscriptionIO({
            type: 'query',
            loadMethod,
            socketID,
            collection,
            filter,
            options
        }, this);

        this.setQuerySubscription(subscription);
        return subscription;
    }

    /**
     * Subscribe to a document in a specific collection.
     *
     * @param {string} socketID - The socket ID associated with the subscription.
     * @param {string} collection - The collection to subscribe to.
     * @param {string} docUID - The unique identifier of the document to subscribe to.
     * @returns {SubscriptionIO} - The created SubscriptionIO instance.
     */
    subscribeDoc(socketID, collection, docUID, options) {
        const { loadMethod } = Object(options);
        const subscription = new SubscriptionIO({
            type: 'doc',
            socketID,
            collection,
            docUID,
            loadMethod
        }, this);

        this.setDocSubscription(subscription);
        return subscription;
    }

    /**
     * Set a query subscription by appending the subscription on the SubscriberIO instance.
     *
     * @param {SubscriptionIO} subscription - The subscription to set.
     */
    setQuerySubscription(subscription) {
        const isSubscriptionIO = subscription instanceof SubscriptionIO;
        if (!isSubscriptionIO) {
            return;
        }

        const querySubs = this.subscriptions.query;
        let collectionSubs = querySubs[subscription.collection];
        if (!querySubs[subscription.collection]) {
            collectionSubs = querySubs[subscription.collection] = [];
        }

        collectionSubs.push(subscription);
    }

    /**
     * Get query subscriptions for a specific collection.
     *
     * @param {string} collection - The collection to get subscriptions for.
     * @returns {SubscriptionIO[]} - Array of query subscriptions.
     */
    getQuerySubscriptions(collection) {
        const querySubs = this.subscriptions.query;
        return querySubs[collection] || [];
    }

    /**
     * Set a document subscription by appending the subscription on the SubscriberIO instance.
     *
     * @param {SubscriptionIO} subscription - The subscription to set.
     */
    setDocSubscription(subscription) {
        const isSubscriptionIO = subscription instanceof SubscriptionIO;
        if (!isSubscriptionIO) {
            return;
        }

        const subs = this.subscriptions.doc;
        let collectionDocs = subs[subscription.collection];
        if (!collectionDocs) {
            collectionDocs = subs[subscription.collection] = {};
        }

        let docSubs = collectionDocs[subscription.docUID];
        if (!docSubs) {
            docSubs = collectionDocs[subscription.docUID] = [];
        }

        docSubs.push(subscription);
    }

    /**
     * Get document subscriptions for a specific collection and document UID.
     *
     * @param {string} collection - The collection to get subscriptions for.
     * @param {string} docUID - The document UID to get subscriptions for.
     * @returns {SubscriptionIO[]} - Array of document subscriptions.
     */
    getDocSubscriptions(collection, docUID) {
        const subs = this.subscriptions.doc;
        const collectionDocs = subs[collection];

        return collectionDocs && collectionDocs[docUID] || [];
    }

    /**
     * Close a subscription.
     *
     * @param {SubscriptionIO} subscription - The subscription to close.
     */
    closeSubscription(subscription) {
        const { collection, docUID } = Object(subscription);

        if (subscription.type === 'query') {
            const subs = this.getQuerySubscriptions(collection);
            const subIndex = subs ? subs.indexOf(subscription) : undefined;

            if (isNaN(subIndex) || subIndex < 0) {
                return;
            }

            const querySubs = this.subscriptions.query;
            const collectionSubs = querySubs[collection];

            if (collectionSubs) {
                collectionSubs.splice(subIndex, 1);
            }
        }

        if (subscription.type === 'doc') {
            const subs = this.getDocSubscriptions(collection, docUID);
            const subsIndex = subs ? subs.indexOf(subscription) : undefined;

            if (isNaN(subsIndex) || subsIndex < 0) {
                return;
            }

            subs.splice(subsIndex, 1);
            if (!this.getDocSubscriptions(collection, docUID).length) {
                delete this.subscriptions.doc[collection][docUID];
            }
        }
    }

    /**
     * Build a Subscriber configuration object, when you need to store the configs, but not initialize yet.
     *
     * @static
     * @param {Object} setup - Configuration object for the Subscriber.* @param {Object} setup - Configuration object for the SubscriberIO.
     * @param {Function} setup.onCreate - Configuration object for the SubscriberIO.
     * @param {Function} setup.onUpdate - Configuration object for the SubscriberIO.
     * @param {Function} setup.onDelete - Configuration object for the SubscriberIO.
     * @param {Function} setup.onSubscribe - Configuration object for the SubscriberIO.
     * @param {Function} setup.customLoadDocs - Configuration object for the SubscriberIO.
     * @param {Function} setup.customLoadQueries - Configuration object for the SubscriberIO.
     * @param {string} setup.eventNamePrefix - Configuration object for the SubscriberIO.
     * @returns {Object} - The constructed Subscriber configuration object.
     */
    static buildSubscriber(setup) {
        const { updateEventName, onSubscribe, onCreate, onUpdate, onDelete, customLoadDocs, customLoadQueries } = Object(setup);

        return {
            ...ServerIO.buildNamespace(setup),
            isSubscriber: true,
            updateEventName,
            customLoadDocs,
            customLoadQueries,
            onSubscribe,
            onCreate,
            onUpdate,
            onDelete
        };
    }
}

module.exports = SubscriberIO;
