const { io } = require("socket.io-client");

/**
 * Class representing a SocketClient.
 */
class SocketClient {
    /**
     * Create a SocketClient.
     * @param {Object} setup - The setup configuration.
     * @param {string} setup.url - The setup configuration.
     * @param {function} setup.connectedCB - The setup configuration.
     * @param {Object} params - The connection parameters.
     */
    constructor(setup, params) {
        try {
            const { url, connectedCB } = Object(setup);

            // Create a new socket connection
            this.io = io(url, params);

            // Set up 'connect' event listener
            this.io.on('connect', () => {
                console.log('Socket connected to: ', url);
                
                // Call the connected callback if it's a function
                if (typeof connectedCB === 'function') {
                    connectedCB();
                }
            });

            // Set up 'disconnect' event listener
            this.io.on('disconnect', () => console.log('Socket connetion with "url" was lost!'));
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    /**
     * Add a listener for a specific event.
     * @param {string} eventName - The name of the event.
     * @param {function} callback - The callback to be called when the event is triggered.
     * @return {Object} The socket object.
     */
    addListener(eventName, callback) {
        return this.io.on(eventName, callback);
    }

    /**
     * Trigger a specific event.
     * @param {string} eventName - The name of the event.
     * @param {Object} data - The data to be sent with the event.
     * @return {Object} The socket object.
     */
    triggerEvent(eventName, data) {
        return this.io.emit(eventName, data);
    }

    /**
     * Send a message.
     * @param {string} msg - The message to be sent.
     * @return {Object} The socket object.
     */
    sendMsg(msg) {
        return this.io.emit('message', msg);
    }
}

module.exports = SocketClient;
