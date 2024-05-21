const { SubscriberIO, CRUD } = require('4hands-api')

const PATH = '/subscribe-changes';
module.exports = SubscriberIO.buildSubscriber({
    path: PATH,
    onConnect(socket) {
        console.log(`User is connected on ${PATH}:`, socket.id);
    },
    onDisconnect(socketID) {
        console.log(`User is disconnected from ${PATH}:`, socketID);
    },
    onSubscribe(socket, setup, callback = () => {}) {
        const { type, collection, filter, docUID, options } = Object(setup);

        if (type === 'query') {
            const subscription = this.subscribeQuery(socket.id, collection, filter, options);
            callback(subscription);
        }
        
        if (type === 'doc') {
            const subscription = this.subscribeDoc(socket.id, collection, docUID);
            callback(subscription);
        }
    },
    onCreate(collection, docSnapshot) {
        const querySubscriptions = this.getQuerySubscriptions(collection);
        querySubscriptions.map(sub => sub.exec('save', docSnapshot));
    },
    onUpdate(collection, docSnapshot) {
        const querySubscriptions = this.getQuerySubscriptions(collection);
        querySubscriptions.map(sub => sub.exec('update', docSnapshot));

        const docSubscriptions = this.getDocSubscriptions(collection, docSnapshot.id);
        docSubscriptions.map(sub => sub.exec('update', docSnapshot));
    },
    onDelete() {

    },
    onError(err) {
        throw logError(err);
    }
});
