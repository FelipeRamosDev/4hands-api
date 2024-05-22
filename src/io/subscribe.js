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
            subscription = this.subscribeDoc(socket.id, collection, docUID);
        }

        if (subscription) {
            socket.on('disconnect', () => subscription.terminate());
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

        const docSubscriptions = this.getDocSubscriptions(collection, docSnapshot.id);
        if (Array.isArray(docSubscriptions)) {
            docSubscriptions.map(sub => sub.exec('update', docSnapshot));
        }
    },

    onError(err) {
        throw logError(err);
    },

    ...CUSTOM_CONFIGS
});
