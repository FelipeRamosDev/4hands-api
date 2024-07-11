const DBQuery = require('./services/DBQuery');

class _4HandsAPIClient {
   constructor (setup) {
      const {
         apiURL = 'http://localhost',
         sockets = [],
         useSubscription = false,
         subscriptionPort = 5000,
      } = Object(setup);

      this._sockets = new Map();
      sockets.map(socket => this.createSocket(socket));

      this.apiURL = apiURL;
      this.useSubscription = useSubscription;

      if(useSubscription) {
         this.createSocket({
            id: 'subscription',
            hostURL: this.apiURL,
            port: subscriptionPort,
            routePath: '/subscribe-changes'
         });
      }
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

   deleteSocket(path) {
      this._sockets.delete(path);
   }
}

module.exports = _4HandsAPIClient;
