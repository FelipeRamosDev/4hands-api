const io = require('socket.io-client');

class SocketIO {
   constructor (setup, instance) {
      const {
         id,
         routePath = '/',
         hostURL = 'http://localhost',
         port = 5000,
         onConnect = () => {},
         onDisconnect = () => {},
         onData = () => {},
         onError = (error) => { throw error; }
      } = Object(setup);

      this.id = id;
      this.hostURL = hostURL;
      this.port = port;
      this.routePath = routePath;

      this._instance = () => instance;
      this._socket = io(this.url);
      this._onConnect = onConnect.bind(this);
      this._onDisconnect = onDisconnect.bind(this);
      this._onData = onData.bind(this);
      this._onError = onError.bind(this);

      this._socket.on('connect', (connection) => {
         this._onConnect(connection);
         this._connection = connection;

         this._socket.on('message', this._onData);
         this._socket.on('error', this._onError);
         this._socket.on('disconnect', () => {
            this._onDisconnect();
            this.parent.deleteSocket(this.routePath);
         });
      });
   }

   get url() {
      return `${this.hostURL}:${this.port}${this.routePath}`;
   }

   get parent() {
      return this._instance();
   }

   sendTo(name, data, callback) {
      this._socket.emit(name, data, callback);
   }

   listenTo(name, callback) {
      if (this._connection) {
         this._connection.on(name, callback);
      } else {
         this._socket.on(name, callback);
      }
   }
}

module.exports = SocketIO;
