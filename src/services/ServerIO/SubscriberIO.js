const ServerIO = require('./index');
const SubscriptionIO = require('./SubscriptionIO');

class SubscriberIO extends ServerIO {
    constructor(setup, serverIO) {
        super(setup, serverIO);
        const {
            onCreate,
            onUpdate,
            onDelete,
            onSubscribe = () => {},
            eventNamePrefix = 'subscribe'
        } = Object(setup);

        this.isSubscriber = true;
        this.eventNamePrefix = eventNamePrefix;

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
                const [collection] = args;
                if (collection === 'counter') {
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

    getEventName(eventType) {
        let prefix = this.eventNamePrefix;

        if ((prefix[prefix.length - 1] !== ':') && eventType) {
            prefix += ':';
        }

        return `${prefix}${eventType || ''}`;
    }

    subscribeQuery(socketID, collection, filter, options) {
        const subscription = new SubscriptionIO({
            type: 'query',
            socketID,
            collection,
            filter,
            options
        }, this);

        this.setQuerySubscription(subscription);
        return subscription;
    }

    subscribeDoc(socketID, collection, docUID) {
        const subscription = new SubscriptionIO({
            type: 'doc',
            socketID,
            collection,
            docUID
        }, this);

        this.setDocSubscription(subscription);
        return subscription;
    }

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

    getQuerySubscriptions(collection) {
        const querySubs = this.subscriptions.query;
        return querySubs[collection] || [];
    }

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

    getDocSubscriptions(collection, docUID) {
        const subs = this.subscriptions.doc;
        const collectionDocs = subs[collection];

        return collectionDocs && collectionDocs[docUID] || [];
    }

    closeSubscription(socketID) {
        delete this.subscriptions[socketID];
    }

    static buildSubscriber(setup) {
        const { updateEventName, onSubscribe, onCreate, onUpdate, onDelete } = Object(setup);

        return {
            ...ServerIO.buildNamespace(setup),
            isSubscriber: true,
            updateEventName,
            onSubscribe,
            onCreate,
            onUpdate,
            onDelete
        }
    }
}

module.exports = SubscriberIO;

