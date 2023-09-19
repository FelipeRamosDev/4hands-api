const crypto = require('crypto');

class SocketSubscription {
    constructor(setup, connection) {
        try {
            const { subscriptionUID } = Object(setup);

            this.subscriptionUID = subscriptionUID || crypto.randomBytes(8).toString('hex');

            if (connection) {
                this.connection = connection;
                this.connection.subscriptions.push(this.connection);
            } else {
                throw new Error.Log({
                    name: 'NO_SOCKET_CONNECTION',
                    message: `It's require to provide a socket connection to instantiate a subscription!`
                });
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    get socket() {
        if (this.connection) {
            return this.connection.socket;
        }
    }
}

module.exports = SocketSubscription;
