const { Server } = require('socket.io');
const Config = require('@config');
const SocketConnection = require('./SocketConnection');

class SocketServer {
    constructor(setup) {
        try {
            const { hosts, port } = Object(setup);

            this.io = new Server({ cors: {
                origin: ['http://localhost', 'https://localhost', ...(hosts || [])]
            }});

            this.port = port || Config.socketServerPort;
            this.connections = [];
            this.subscriptions = [];

            this.init();
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    init() {
        try {
            this.io.on('connect', (socket) => {
                const connection = new SocketConnection(socket, this);
                this.connections.push(connection);

                socket.on('disconnect', () => {
                    this.connections = this.connections.filter(item => item.connected);
                });
            });

            this.io.listen(this.port);
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    getConnection(connectionID) {
        try {
            return this.connections.find(item => item.socket.id = connectionID);
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = SocketServer;

