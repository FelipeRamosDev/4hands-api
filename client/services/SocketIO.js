const io = require('socket.io-client');

/**
 * Class representing a Socket.IO connection.
 */
class SocketIO {
   /**
    * Create a SocketIO instance.
    * @param {Object} setup - The setup object.
    * @param {string} setup.id - The identifier for the socket instance.
    * @param {string} [setup.routePath='/'] - The route path for the socket connection.
    * @param {string} [setup.hostURL='http://localhost'] - The host URL for the socket connection.
    * @param {number} [setup.port=5000] - The port for the socket connection.
    * @param {Function} [setup.onConnect=()=>{}] - The callback function for when the socket connects.
    * @param {Function} [setup.onDisconnect=()=>{}] - The callback function for when the socket disconnects.
    * @param {Function} [setup.onData=()=>{}] - The callback function for when the socket receives data.
    * @param {Function} [setup.onError=(error)=>{throw error;}] - The callback function for when the socket encounters an error.
    * @param {Object} instance - The instance object.
    */
   constructor(setup, instance) {
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

      this._socket.on('connect', () => {
         this._onConnect();

         this._socket.on('message', this._onData);
         this._socket.on('error', this._onError);
         this._socket.on('disconnect', () => {
            this._onDisconnect();
            this.parent.closeSocket(this.routePath);
         });
      });
   }

   /**
    * Get the full URL for the socket connection.
    * @returns {string} The full URL.
    */
   get url() {
      return `${this.hostURL}:${this.port}${this.routePath}`;
   }

   /**
    * Get the parent instance.
    * @returns {Object} The parent instance.
    */
   get parent() {
      return this._instance();
   }

   /**
    * Send data to a specified event.
    * @param {string} name - The name of the event.
    * @param {Object} data - The data to send.
    * @param {Function} [callback] - The callback function.
    */
   sendTo(name, data, callback) {
      this._socket.emit(name, data, callback);
   }

   /**
    * Listen to a specified event.
    * @param {string} name - The name of the event.
    * @param {Function} callback - The callback function.
    */
   listenTo(name, callback) {
      this._socket.on(name, callback);
   }
}

module.exports = SocketIO;
