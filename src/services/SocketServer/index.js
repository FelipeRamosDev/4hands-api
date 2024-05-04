/**
 * Module providing functionality for handling socket connections and managing subscriptions.
 * @module SocketServer
 * @namespace Services
 */

const Config = require('4hands-api/configs/project');
const Server = require('socket.io').Server;
const SocketConnection = require('./SocketConnection');

/**
 * Represents a socket server that manages socket connections and subscriptions.
 * @class
 * @param {Object} setup - The setup object.
 * @param {string[]} setup.hosts - An array of allowed hosts for CORS configuration.
 * @param {number} setup.port - The port on which the socket server will listen. Defaults to the value specified in the configuration.
 * @param {function} connectedCB - The callback function to be called when a connection is established.
 */
class SocketServer {
    /**
     * Creates a new instance of the SocketServer class.
     * @constructor
     * @param {Object} setup - The setup object containing hosts and port information.
     * @param {function} connectedCB - The callback function to be called when a connection is established.
     */
    constructor(setup, connectedCB) {
        try {
            const { hosts, port } = Object(setup);

            /**
             * The socket.io server instance.
             * @type {object}
             */
            this.io = new Server({ cors: {
                origin: ['http://localhost', 'https://localhost', ...(hosts || [])]
            }});

            /**
             * The port on which the socket server is running.
             * @type {number}
             */
            this.port = port || Config.socketServerPort;

            /**
             * An array of active socket connections.
             * @type {SocketConnection[]}
             */
            this.connections = [];

            /**
             * An array of active subscriptions.
             * @type {Array}
             */
            this.subscriptions = [];

            this.init(connectedCB);
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Initializes the socket server by setting up event listeners for incoming connections and disconnections.
     * @private
     * @param {function} connectedCB - The callback function to be called when a connection is established.
     */
    init(connectedCB) {
        try {
            this.io.on('connect', (socket) => {
                const connection = new SocketConnection(socket, this);
                this.connections.push(connection);

                socket.on('disconnect', () => {
                    this.connections = this.connections.filter(item => item.connected);
                });

                if (typeof connectedCB === 'function') {
                    connectedCB(socket);
                }
            });

            this.io.listen(this.port);
        } catch (err) {
            throw logError(err);
        }
    }

    /**
     * Retrieves a socket connection based on the provided connection ID.
     * @param {string} connectionID - The unique identifier of the socket connection.
     * @returns {SocketConnection|undefined} - The socket connection with the given ID or undefined if not found.
     */
    getConnection(connectionID) {
        try {
            return this.connections.find(item => item.socket.id === connectionID);
        } catch (err) {
            throw logError(err);
        }
    }
}

module.exports = SocketServer;
