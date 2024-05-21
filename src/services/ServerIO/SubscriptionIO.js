const crypto = require('crypto');
const CRUD = require('4hands-api/src/services/database/crud');

class SubscriptionIO {
    constructor(setup, subscriber) {
        const { socketID, type, collection, docUID, filter, options } = Object(setup);

        if (!type || !collection) {
            throw logError('common.missing_params');
        }

        this._subscriber = () => subscriber;
        this.id = crypto.randomUUID();
        this.socketID = socketID;
        this.type = type;
        this.collection = collection;

        if (type === 'query') {
            this.filter = filter;
            this.options = options;

            this.loadQuery().then(() => {
                this.sendCallback({ success: true, snapshotEvent: this.id });
            });
        }

        if (type === 'doc') {
            this.docUID = docUID;
            this.loadDoc();
        }
    }

    get subscriber() {
        return this._subscriber();
    }

    sendCallback(data) {
        const socket = this.subscriber.getConnection(this.socketID);

        if (socket) {
            socket.emit('new-subscription', data);
        }
    }

    sendSnapshot(data) {
        const socket = this.subscriber.getConnection(this.socketID);

        if (socket) {
            socket.emit(this.id, data);
        }
    }

    async loadQuery() {
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
            if (loaded.error) {
                this.subscriber.closeSubscription(this.socketID);
                throw toError(loaded);
            }

            this.uidString = loaded.map(item => item.id).join('');
            this.lastQueryLoaded = loaded;

            // Sending to FE side
            this.sendSnapshot(loaded);
            return loaded;
        } catch (err) {
            throw toError(err);
        }
    }

    async loadDoc() {
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
            this.sendSnapshot(doc);
            return doc;
        } catch (err) {
            throw toError(err);
        }
    }

    async exec(eventType, docSnapshot) {
        const { id } = Object(docSnapshot);

        switch (eventType) {
            case 'save': {
                if (this.type === 'query') {
                    const isMatch = await CRUD.getDoc({
                        collectionName: this.collection,
                        filter: { _id: id, ...this.filter }
                    });
                    
                    if (isMatch) {
                        this.loadQuery();
                    }
                }
            }
            case 'update': {
                if (this.type === 'query') {
                    if (this.uidString.indexOf(id) > -1) {
                        this.loadQuery();
                    }
                }

                if (this.type === 'doc') {
                    this.loadDoc();
                }
            }
        }
    }
}

module.exports = SubscriptionIO;
