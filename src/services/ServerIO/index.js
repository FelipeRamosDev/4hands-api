const RoomIO = require('./RoomIO');
const socketIO = require('socket.io');

/**
 * Class representing a ServerIO.
 */
class ServerIO {
    /**
     * Create a ServerIO.
     * @param {Object} setup - The setup object.
     * @param {string} setup.path - The namespace path.
     * @param {number} setup.port - The server port.
     * @param {Object} setup.ssl - The server SSL certificate configurations.
     * @param {string} setup.ssl.key - The SSL key file content.
     * @param {string} setup.ssl.cert - The SSL certificate file content.
     * @param {string} setup.ssl.keyPath - The SSL key file path.
     * @param {string} setup.ssl.certPath - The SSL certificate file file.
     * @param {string[]} setup.corsOrigin - The server cors policy.
     * @param {Function[]} setup.middlewares - The server/namespace middlewares.
     * @param {Function} setup.onConnect - The callback for when the socket connection is concluded with success.
     * @param {Function} setup.onData - The callback for when an 'message' event arrives.
     * @param {Function} setup.onDisconnect - The callback for when the client disconnected.
     * @param {Function} setup.onError - The callback for when an error is caught.
     * @param {Object} serverIO - The serverIO object.
     */
    constructor(setup, serverIO) {
        const {
            path,
            port = 8888,
            ssl,
            corsOrigin = ['http://localhost', 'https://localhost'],
            middlewares = [],
            onConnect = () => {},
            onData = () => {},
            onDisconnect = () => {},
            onError = (err) => {
                throw err;
            },
        } = Object(setup);
        let { toCreateNamespaces = [] } = Object(setup);

        this._serverIO = () => serverIO;
        this.isSubscriber = false;
        this.path = path;
        this.ssl = ssl;
        this.middlewares = middlewares;
        this.namespaces = {};
        this.rooms = {};

        if (!serverIO) {
            // If doesn't have the serverIO param declared, means that it's the main instance so the server should be declared
            this.isMainIO = true;
            this.port = Number(port);
            this.corsOrigin = corsOrigin;

            const serverOptions = { cors: { origin: corsOrigin } };
            const isSSLValid = [
                (this.ssl?.key && this.ssl?.cert),
                (this.ssl?.keyPath && this.ssl?.certPath)
            ].some(item => item);
            
            if (isSSLValid) {
                this.io = socketIO(this.createHttps(), serverOptions);
            } else {
                this.io = socketIO(port, serverOptions);
            }

            toCreateNamespaces = [
                require('../../io/subscribe'),
                ...toCreateNamespaces
            ];

            toCreateNamespaces.map(space => this.createNamespace(space));
        } else {
            // This means a namespace under the serverIO param. Param path is require for this case
            if (!this.path) {
                throw 'The param "path" is required!';
            }

            this.io = serverIO.io.of(this.path);
        }

        // Adding MIDDLEWARES provided
        this.middlewares.map(middle => {
            this.io.use(middle);
        });

        // Adding EVENTS listeners
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

    /**
     * Get the serverIO.
     * @return {Object} The serverIO object.
     */
    get serverIO() {
        return this._serverIO();
    }

    /**
     * Get the mainIO.
     * @return {Object} The mainIO object.
     */
    get mainIO() {
        return this.serverIO.io;
    }

    createHttps() {
        const https = require('https');
        const FS = require('../FS');
        const serverOptions = {};

        if (this.ssl.key && this.ssl.cert) {
            // In case of the file be provided
            serverOptions.key = this.ssl.key;
            serverOptions.cert = this.ssl.cert;
        } else if (this.ssl.keyPath && this.ssl.certPath) {
            // In case of the file PATH be provided
            const isKeyExist = FS.isExist(this.ssl.keyPath);
            const isCertExist = FS.isExist(this.ssl.certPath);
            const keyContent = FS.readFileSync(this.ssl.keyPath);
            const certContent = FS.readFileSync(this.ssl.certPath);

            if (!isKeyExist || !isCertExist) {
                throw new Error('SSL files wasn\'t found!');
            }

            serverOptions.key = keyContent;
            serverOptions.cert = certContent;
        }

        const server = https.createServer(serverOptions);
        server.listen(this.port);
        return server;
    }

    /**
     * Get the connection.
     * @param {string} socketID - The ID of the socket.
     * @return {Object} The connection object.
     */
    getConnection(socketID) {
        if (this.serverIO) {
            return this.io.sockets.get(socketID);
        } else {
            return this.io.sockets.sockets.get(socketID);
        }
    }

    /**
     * Post a message.
     * @param {Object} data - The data to post.
     * @param {function} cb - The callback function.
     */
    postMessage(data, cb) {
        this.io.emit('message', data, cb);
    }

    /**
     * Get the room.
     * @param {string} roomID - The ID of the room.
     * @return {Object} The room object.
     */
    toRoom(roomID) {
        return this.io.to(roomID);
    }

    /**
     * Post a message to a room.
     * @param {string} roomID - The ID of the room.
     * @param {Object} data - The data to post.
     * @param {function} cb - The callback function.
     */
    postMessageTo(roomID, data, cb) {
        this.toRoom(roomID).emit('message', data, cb);
    }

    /**
     * Broadcast a message.
     * @param {Object} data - The data to broadcast.
     * @param {function} cb - The callback function.
     */
    broadcastMessage(data, cb) {
        this.io.broadcast.emit('message', data, cb);
    }

    /**
     * Create a namespace.
     * @param {Object} nsSetup - The setup object for the namespace.
     * @return {Object} The namespace object.
     */
    createNamespace(nsSetup) {
        if (!nsSetup) {
            return;
        }

        let namespaceIO;
        if (nsSetup.isSubscriber) {
            const SubscriberIO = require('./SubscriberIO');
            namespaceIO = new SubscriberIO(nsSetup, this);
        } else {
            namespaceIO = new ServerIO(nsSetup, this);
        }

        this.appendNamespace(namespaceIO);
        return namespaceIO;
    }

    /**
     * Append a namespace.
     * @param {Object} namespace - The namespace object.
     */
    appendNamespace(namespace) {
        if (!this.isMainIO) {
            return;
        }

        this.namespaces[namespace.path] = namespace;
    }

    /**
     * Create a room.
     * @param {string} id - The ID of the room.
     * @param {Object} options - The options object for the room.
     * @return {RoomIO} The room object.
     */
    createRoom(id, options) {
        const { name, participants, isPrivate } = Object(options);

        if (typeof id !== 'string') {
            return;
        }

        const newRoom = new RoomIO({ id, name, participants, isPrivate }, this);
        this.appendRoom(newRoom);
        return newRoom;
    }

    /**
     * Join a room.
     * @param {string} roomID - The ID of the room.
     * @param {string} participantID - The ID of the participant.
     * @param {string} name - The name of the participant.
     * @return {RoomIO} The room object.
     */
    joinRoom(roomID, participantID, name) {
        let room = this.getRoom(roomID);

        if (!room) {
            this.createRoom(roomID, { name, participants: [participantID] });
            room = this.getRoom(roomID);
        }

        room.join(participantID);
        return room;
    }

    /**
     * Delete a room.
     * @param {string} id - The ID of the room.
     */
    deleteRoom(id) {
        delete this.rooms[id];
    }

    /**
     * Append a room.
     * @param {Object|RoomIO} room - The room object.
     */
    appendRoom(room) {
        if (!room || !(room instanceof RoomIO)) {
            return;
        }

        this.rooms[room.id] = room;
    }

    /**
     * Get a room.
     * @param {string} roomID - The ID of the room.
     * @return {RoomIO} The room object.
     */
    getRoom(roomID) {
        return this.rooms[roomID];
    }

    /**
     * Build a namespace.
     * @param {Object} setup - The setup object for the namespace.
     * @param {string} setup.path - The path to connect with the namespace.
     * @param {function[]} setup.middlewares - Middlewares to execute before connecting.
     * @param {function} setup.onConnect - Callback to execute when connection is completed with success.
     * @param {function} setup.onDisconnect - Callback to execute when the client disconnect.
     * @param {function} setup.onData - Callback to execute when a 'message' event arrives from the FE side.
     * @param {function} setup.onError - Callback to execute when there is an error with the connection.
     * @return {Object} The namespace config object.
     */
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
