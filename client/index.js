const Auth = require('./models/Auth');
const DBQuery = require('./models/DBQuery');
const AJAX = require('./services/AJAX');
const Utils = require('./utils');

/**
 * The main instance class to be declared in order to use the 4hands-api on client side.
 * @class
 */
class _4HandsAPIClient {
   /**
    * @constructor
    * @param {Object} setup - The setup params.
    * @param {AJAX} setup.ajaxConfig - The configuration for the AJAX instance.
    * @param {string} [setup.apiHost='http://localhost'] - 
    * @param {number} [setup.apiPort=8000] - The port to access the backend with 4hands-api server.
    * @param {SocketIO[]} [setup.sockets=[]] - Socket instances to initialized.
    * @param {boolean} [setup.useSubscription=false] - If you want to use the database docs subscriptions, this needs to be set as true.
    * @param {number} [setup.subscriptionPort=5000] - The socket connection port on backend that is listen to /subscribe-changes socket route.
    */
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

   /**
    * @readonly
    * @returns {string} - The api url for requests
    */
   get apiURL() {
      return `${this.apiHost}:${this.apiPort}`;
   }

   get auth() {
      return new Auth(this);
   }

   /**
    * Model to interact with database on backend side.
    * @param {string} collection - The collection name.
    * @param {Object} filter - The mongoose filter to use.
    * @returns {DBQuery} - Retrieve the DBQuery model.
    */
   dbQuery(collection, filter) {
      return new DBQuery(collection, filter, this);
   }

   /**
    * Creates a new Socket connection
    * @param {object} setup 
    * @returns {void}
    */
   createSocket(setup) {
      const SocketIO = require('./services/SocketIO');
      
      try {
         const newSocket = new SocketIO(setup, this);
         this._sockets.set(newSocket.id || newSocket.routePath, newSocket);
      } catch (error) {
         throw error;
      }
   }

   /**
    * Retrieve a Socket instance already existent.
    * @param {string} path - SocketIO name to get.
    * @returns {SocketIO} - The SocketIO instance.
    */
   getSocket(path) {
      return this._sockets.get(path);
   }

   /**
    * Closes the given SocketIO instance.
    * @param {string} path - SocketIO name to close.
    */
   closeSocket(path) {
      this._sockets.delete(path);
   }
}

module.exports = _4HandsAPIClient;
