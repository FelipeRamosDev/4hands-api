const socketIO = require('socket.io');

class ServerIO {
     /**
     * Build a ServerIO setup configs.
     * @constructor
     * @param {object} setup - New namespace configs
     * @param {string} setup.path - Path for the new namespace that will be created.
     * @param {number} setup.port - Path for the new namespace that will be created.
     * @param {function[]} setup.middlewares - Array with middleware functions that receives (socket, next) as paramenter.
     * @param {function} setup.onConnect - Callback.
     * @param {function} setup.onDisconnect - Callback.
     * @param {function} setup.onData - Callback.
     * @param {function} setup.onError - Callback.
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
            socket.on('disconnect', () => onDisconnect.call(this, socket.id));

            onConnect.call(this, socket);
        });
    }

    get serverIO() {
        return this._serverIO();
    }

    get mainIO() {
        return this.serverIO.io;
    }
    
    postMessage(data, cb) {
        this.io.emit('message', data, cb);
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
        this.namespaces[namespace.path] = namespace;
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
