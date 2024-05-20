const { SubscriberIO } = require('4hands-api')

module.exports = SubscriberIO.buildSubscriber({
    path: '/subscribe',
    middlewares: [
        function (socket, next) {
            console.log('Middleware /subscribe connection:', socket.id);
            next();
        }
    ],
    onConnect(socket) {
        console.log('User connected on /subscribe:', socket.id);
    },
    onDisconnect() {

    },
    onUpdate(collection, doc) {
        debugger;
    },
    onError(err) {
        throw logError(err);
    }
});
