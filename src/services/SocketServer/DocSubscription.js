const SocketSubscription = require('./SocketSubscription');
const CRUD = require('@CRUD');

class DocSubscription extends SocketSubscription {
    constructor(setup, connection) {
        super(setup, connection);

        try {
            const { doc, collectionName, filter } = Object(setup);

            this.type = 'doc';
            this.doc = doc;
            this.collectionName = collectionName;
            this.filter = filter;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async trigger() {
        try {
            const doc = await this.handler();

            if (!doc) {
                this.socket.emit('subscribe:doc:null', new Error.Log({
                    name: 'NOT_FOUND',
                    message: `The document requested wasn't found!`
                }));
            }

            this.socket.emit('subscribe:doc:data', doc);
            return doc.toSuccess();
        } catch (err) {
            this.socket.emit('subscribe:doc:error', new Error.Log(err));
        }
    }

    async handler() {
        const { collectionName, filter } = Object(this);

        try {
            const docQuery = await CRUD.getDoc({ collectionName, filter }).defaultPopulate();
            const doc = docQuery.initialize();

            this.doc = doc;
            return doc;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = DocSubscription;
