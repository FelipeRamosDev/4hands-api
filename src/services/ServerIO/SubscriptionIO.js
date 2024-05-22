const crypto = require('crypto');
const CRUD = require('4hands-api/src/services/database/crud');

class SubscriptionIO {
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

    get subscriber() {
        return this._subscriber();
    }

    get customLoadQueries() {
        return this.subscriber?.customLoadQueries;
    }

    get customLoadDocs() {
        return this.subscriber?.customLoadDocs;
    }

    get customLoadMethod() {
        let loadMethod;
        
        if (this.type === 'query') {
            if (!this.customLoadQueries) {
                return;
            }

            loadMethod = this.customLoadQueries[this.loadMethod]
        }
        
        if (this.type === 'doc') {
            if (!this.customLoadDocs) {
                return;
            }

            loadMethod = this.customLoadDocs[this.loadMethod]
        }

        if (typeof loadMethod === 'function') {
            return loadMethod;
        }
    }

    sendSnapshot(data) {
        const socket = this.subscriber.getConnection(this.socketID);

        if (socket) {
            socket.emit(this.id, data);
        }
    }

    async loadQuery(jumpCustom, preventSnapshot) {
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

    async loadDoc(jumpCustom, preventSnapshot) {
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

    async exec(eventType, docSnapshot) {
        const { id } = Object(docSnapshot);

        switch (eventType) {
            case 'save': {
                if (this.type === 'query') {
                    const isMatch = await CRUD.getDoc({
                        collectionName: this.collection,
                        filter: { _id: id, ...Object(this.filter) }
                    });
                    
                    if (isMatch) {
                        this.loadQuery();
                    }

                    break;
                }
            }
            case 'update': {
                if (this.type === 'query') {
                    if (this.uidString && this.uidString.indexOf(id) > -1) {
                        this.loadQuery();
                    }
                }

                if (this.type === 'doc') {
                    this.loadDoc();
                }

                break;
            }
        }
    }

    terminate() {
        return this.subscriber.closeSubscription(this);
    }
}

module.exports = SubscriptionIO;
