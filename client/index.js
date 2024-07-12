const DBQuery = require('./models/DBQuery');
const AJAX = require('./services/AJAX');
const Utils = require('./utils');

class _4HandsAPIClient {
   constructor (setup) {
      const {
         ajaxConfig,
         apiHost = 'http://localhost',
         apiPort = 8000,
         sockets = [],
         useSubscription = false,
         subscriptionPort = 5000,
      } = Object(setup);

      this._sockets = new Map();
      sockets.map(socket => this.createSocket(socket));

      this.apiHost = apiHost;
      this.apiPort = apiPort;
      this.useSubscription = useSubscription;
      this.subscriptionPort = subscriptionPort;

      this.ajax = new AJAX(ajaxConfig, this);
      this.utils = Utils;

      if(useSubscription) {
         this.createSocket({
            id: 'subscription',
            hostURL: this.apiHost,
            port: subscriptionPort,
            routePath: '/subscribe-changes'
         });
      }
   }

   get apiURL() {
      return `${this.apiHost}:${this.apiPort}`;
   }

   dbQuery(collection, filter) {
      return new DBQuery(collection, filter, this);
   }

   createSocket(setup) {
      const SocketIO = require('./services/SocketIO');
      
      try {
         const newSocket = new SocketIO(setup, this);
         this._sockets.set(newSocket.id || newSocket.routePath, newSocket);
      } catch (error) {
         throw error;
      }
   }

   getSocket(path) {
      return this._sockets.get(path);
   }

   closeSocket(path) {
      this._sockets.delete(path);
   }
}

module.exports = _4HandsAPIClient;
