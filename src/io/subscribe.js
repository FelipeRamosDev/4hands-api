const SubscriberIO = require('../services/ServerIO/SubscriberIO');
const FS = require('../services/FS');
const path = require('path');

const PATH = '/subscribe-changes';
const CUSTOM_CONFIGS_PATH = path.normalize(__dirname.replace(path.normalize('/node_modules/4hands-api/src/io'), ('/src/io' + PATH + '.config.js')));
const IS_CUSTOM_CONFIGS_EXIST = FS.isExist(CUSTOM_CONFIGS_PATH);
let CUSTOM_CONFIGS = {};

if (IS_CUSTOM_CONFIGS_EXIST) {
    CUSTOM_CONFIGS = require(CUSTOM_CONFIGS_PATH);
}

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
        let subscription;

        if (type === 'query') {
            subscription = this.subscribeQuery(socket.id, collection, filter, options);
        }
        
        if (type === 'doc') {
            subscription = this.subscribeDoc(socket.id, collection, docUID, filter, options);
        }

        if (subscription) {
            socket.on('disconnect', () => subscription.terminate());
            socket.on('unsubscribe', (id) => {
                if (id && id === subscription.id) {
                    subscription.terminate();
                }
            });

            callback(subscription);
        } else {
            callback(toError());
        }
    },

    onCreate(collection, docSnapshot) {
        const querySubscriptions = this.getQuerySubscriptions(collection);
        querySubscriptions.map(sub => sub.exec('save', docSnapshot));
    },

    onUpdate(collection, docSnapshot) {
        const querySubscriptions = this.getQuerySubscriptions(collection);
        if (Array.isArray(querySubscriptions)) {
            querySubscriptions.map(sub => sub.exec('update', docSnapshot));
        }

        const docUID = docSnapshot.id || docSnapshot.UID || docSnapshot._id;
        const docSubscriptions = this.getDocSubscriptions(collection, docUID.toString());
        if (Array.isArray(docSubscriptions)) {
            docSubscriptions.map(sub => sub.exec('update', docSnapshot));
        }
    },

    onDelete(collection, docSnapshot) {
        const querySubscriptions = this.getQuerySubscriptions(collection);
        if (Array.isArray(querySubscriptions)) {
            querySubscriptions.map(sub => sub.exec('delete', docSnapshot));
        }
    },

    onError(err) {
        logError(err);
    },

    ...CUSTOM_CONFIGS
});
