/**
 * Represents a subscription in a socket connection.
 */
class SocketSubscription {
    /**
     * Creates an instance of SocketSubscription.
     * @param {Object} setup - Configuration options for the subscription.
     * @param {Object} connection - The socket connection associated with the subscription.
     */
    constructor(setup, connection) {
        try {
            /**
             * The unique identifier for the subscription.
             * @type {string}
             */
            const { subscriptionUID } = Object(setup);
            this.subscriptionUID = subscriptionUID || crypto.randomBytes(8).toString('hex');

            if (connection) {
                /**
                 * The socket connection associated with the subscription.
                 * @type {Object}
                 */
                this.connection = connection;
                this.connection.subscriptions.push(this.connection);
            } else {
                throw logError({
                    name: 'NO_SOCKET_CONNECTION',
                    message: `A socket connection is required to instantiate a subscription!`
                });
            }
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Gets the socket object associated with the subscription.
     * @returns {Object|undefined} - The socket object if the connection is available, otherwise undefined.
     */
    get socket() {
        if (this.connection) {
            return this.connection.socket;
        }
    }
}

module.exports = SocketSubscription;
