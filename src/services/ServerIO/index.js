const RoomIO = require('./RoomIO');
const socketIO = require('socket.io');

class ServerIO {
     /**
     * Build a ServerIO setup configs.
     * @constructor
     * @param {object} setup - New namespace configs
     * @param {string} setup.path - Path for the new namespace that will be created.
     * @param {number} setup.port - Path for the new namespace that will be created.
     * @param {function[]} setup.middlewares - Array with middleware functions that receives (socket, next) as paramenter.
     * @param {function} setup.onConnect - Callback for when the socket connection is completed with success.
     * @param {function} setup.onDisconnect - Callback for when the client socket is disconnected.
     * @param {function} setup.onData - Callback for the 'message' socket event.
     * @param {function} setup.onError - Callback for errors during socket connection.
     * @returns {object} With the configs to import on ServerIO to use.
     */
    constructor(setup, serverIO) {
        const {
            path,
            port = 8888,
            corsOrigin = ['http://localhost', 'https://localhost'],
            middlewares = [],
            onConnect = () => {},
            onData = () => {},
            onDisconnect = () => {},
            onError = (err) => {
                throw err;
            },
        } = Object(setup);

        this._serverIO = () => serverIO;
        this.path = path;
        this.middlewares = middlewares;
        this.namespaces = {};
        this.rooms = {};

        if (!serverIO) {
            // If doesn't have the serverIO param declared, means that it's the main instance so the server should be declared
            this.io = socketIO(port, {
                cors: { origin: corsOrigin }
            });
            this.port = Number(port);
            this.corsOrigin = corsOrigin;
        } else {
            // This means a namespace under the serverIO param. Param path is require for this case
            if (!this.path) {
                throw 'The param "path" is required!';
            }

            this.io = serverIO.io.of(this.path);
        }

        this.middlewares.map(middle => {
            this.io.use(middle);
        });

        this.io.on('connect_error', onError.bind(this));
        this.io.on('connect', (socket) => {
            socket.on('message', onData.bind(this));
            socket.on('disconnect', () => {
                this.deleteRoom(socket.id);
                onDisconnect.call(this, socket.id);
            });

            this.createRoom(socket.id, { participants: [socket.id], isPrivate: true});
            onConnect.call(this, socket);
        });
    }

    get serverIO() {
        return this._serverIO();
    }

    get mainIO() {
        return this.serverIO.io;
    }

    getConnection(socketID) {
        if (this.serverIO) {
            return this.io.sockets.get(socketID);
        } else {
            return this.io.sockets.sockets.get(socketID);
        }
    }
    
    postMessage(data, cb) {
        this.io.emit('message', data, cb);
    }

    toRoom(roomID) {
        return this.io.to(roomID);
    }

    postMessageTo(roomID, data, cb) {
        this.toRoom(roomID).emit('message', data, cb);
    }

    broadcastMessage(data, cb) {
        this.io.broadcast.emit('message', data, cb);
    }

    createNamespace(nsSetup) {
        if (!nsSetup) {
            return;
        }

        const namespaceIO = new ServerIO(nsSetup, this);
        this.appendNamespace(namespaceIO);
        return namespaceIO;
    }

    appendNamespace(namespace) {
        if (!namespace?.path || !(namespace instanceof ServerIO)) {
            return;
        }

        this.namespaces[namespace.path] = namespace;
    }

    createRoom(id, options) {
        const { participants, isPrivate } = Object(options);

        if (typeof id !== 'string') {
            return;
        }

        const newRoom = new RoomIO({ id, participants, isPrivate }, this);
        this.appendRoom(newRoom);
        return newRoom;
    }

    joinRoom(roomID, participantID) {
        const room = this.getRoom(roomID);

        if (room) {
            room.join(participantID);
        }

        return room;
    }

    deleteRoom(id) {
        delete this.rooms[id];
    }

    appendRoom(room) {
        if (!room || !(room instanceof RoomIO)) {
            return;
        }

        this.rooms[room.id] = room;
    }

    getRoom(roomID) {
        return this.rooms[roomID];
    }

    static buildNamespace(setup) {
        const { path, middlewares, onConnect, onDisconnect, onData, onError } = Object(setup);

        return {
            path,
            middlewares,
            onConnect,
            onDisconnect,
            onData,
            onError
        };
    }
}

module.exports = ServerIO;
