// Declaring globals
require('./src/global/index');

const CollectionBucket = require('./src/services/CollectionBucket');
const auth_buckets = require('./src/collections/auth_buckets');
const safe_values = require('./src/collections/safe_values');
const users = require('./src/collections/users');

/**
 * The main class to be declared to use the 4hands-api.
 * @class _4HandsAPI
 */
class _4HandsAPI {
   /**
    * @constructor
    * @param {Object} setup - Constructor params
    * @param {boolean} [setup.declareGlobal=false] - If true it will declare the instance as a global._4handsAPI
    * @param {string} [setup.id="4hands-api"] - the id for the instance.
    * @param {Collection[]} setup.collections - Array of Collection objects with the collections declared.
    * @param {Object} setup.database - The database configurations.
     * @param {string} setup.database.dbName - The database name.
     * @param {string} [setup.database.hostURL='mongodb://0.0.0.0:27017/'] - The HOST url. Default is 'mongodb://0.0.0.0:27017/'.
    * @param {Object} setup.serverAPI - The server HTTP configurations.
     * @param {string} setup.serverAPI.API_SECRET - The API secret key for session encryption.
     * @param {number} setup.serverAPI.sessionCookiesMaxAge - Maximum age of session cookies in milliseconds. Default is 86400000.
     * @param {string} setup.serverAPI.staticPath - The path to static files.
     * @param {Function} setup.serverAPI.listenCallback - Callback function to be executed when the server starts listening.
     * @param {string} setup.serverAPI.jsonLimit - Limit of JSON requests. Default is '10mb'.
     * @param {boolean} setup.serverAPI.sessionResave - Flag indicating whether to save session data back to the session store. Default is true.
     * @param {boolean} setup.serverAPI.sessionSaveUninitialized - Flag indicating whether to save uninitialized sessions to the session store. Default is true.
     * @param {string} setup.serverAPI.keySSLPath - The path to the SSL key file.
     * @param {string} setup.serverAPI.certSSLPath - The path to the SSL certificate file.
     * @param {string} setup.serverAPI.FE_ORIGIN - The front-end host URL.
     * @param {number} setup.serverAPI.PORT - The port number on which the server will listen. Default is 80.
     * @param {string[]} setup.serverAPI.corsOrigin - Array with the allowed domains for CORS configuration. Default is ['http://localhost', 'https://localhost'].
     * @param {string[]} setup.serverAPI.httpEndpoints - The path to the endpoints to be created on initialization.
    * @param {RedisService} setup.redis - The redis database configurations.
    * @param {SocketIO} setup.socketIO - The socket server configurations.
    * @param {MailService} setup.emailService - The email service configurations.
    * @param {Function} setup.onReady - A callback function for when the intane is ready.
    * @param {Function} setup.onError - A callback function for when the intane has error.
    */
   constructor(setup) {
      const {
         database,
         serverAPI,
         redis,
         socketIO,
         emailService,
         declareGlobal = false,
         id = '4hands-api',
         onReady = () => {},
         onError = (err) => { throw err; },
         collections = []
      } = Object(setup);

      if (declareGlobal) {
         global._4handsAPI = this;
      }

      /**
       * The instance name.
       * @type {string}
       */
      this.id = id;

      /**
       * is declared as a global.
       * @type {boolean}
       */
      this.declareGlobal = declareGlobal;

      /**
       * The collections for the instance.
       * @type {CollectionBucket}
       */
      this.collections = new CollectionBucket([
         auth_buckets,
         safe_values,
         users,
         ...collections
      ]);

      /**
       * Array with all async functions to init the services.
       * @type {Function[]}
       */
      this.toInit = [];

      (async () => {
         if (redis) {
            this.createRedis(redis);
         }
   
         if (emailService) {
            this.createEmailService(emailService);
         }
   
         if (database) {
            await this.createDatabase(database);
         }
   
         if (serverAPI) {
            this.createServerAPI(serverAPI);
         }
   
         if (socketIO) {
            this.createSocketServer(socketIO);
         }
   
         Promise.all(this.toInit).then(() => {
            onReady.call(this);
         }).catch(err => {
            onError.call(this, err);
         }).finally(() => {
            delete this.toInit;
         });
      })();
   }

   /**
    * The CRUD object.
    * @type {CRUD}
    */
   get CRUD() {
      return this.DB.CRUD;
   }

   async createDatabase(configs) {
      const DBService = require('./src/services/DBService');
      const { onSuccess = () => {}, onError = (err) => { throw err } } = Object(configs);

      /**
       * The database instance.
       * @type {DBService}
       */
      this.DB = new DBService({
         collections: this.collections.toArray(),
         ...configs
      }, this);

      if (this.toInit) {
         this.toInit.push(async () => {
            return await new Promise((resolve, reject) => {
               this.DB.init({ success: resolve, error: reject });
            });
         });
      }

      await this.DB.init({ success: onSuccess.bind(this.DB), error: onError.bind(this.DB) });
      return this.DB;
   }

   createEmailService(configs) {
      const MailService = require('./src/services/Mail');

      /**
       * The email service instance.
       * @property {MailService}
       */
      this.emailService = new MailService(configs);
      return this.emailService;
   }

   createServerAPI(configs) {
      const ServerAPI = require('./src/services/ServerAPI');
      
      /**
       * The server api instance.
       * @type {ServerAPI}
       */
      this.API = new ServerAPI(configs, this);

      if (this.toInit) {
         this.toInit.push(this.API.init);
      }

      return this.API;
   }

   createRedis(configs) {
      const RedisService = require('./src/services/Redis');

      /**
       * The Redis service instance.
       * @type {RedisService}
       */
      this.Redis = new RedisService({
         collections: this.collections,
         ...configs
      }, this);

      if (this.toInit) {
         this.toInit.push(this.Redis.connect);
      }

      return this.Redis;
   }

   createSocketServer(configs) {
      const ServerIO = require('./src/services/ServerIO');

      /**
       * The socket server instance.
       * @type {ServerIO}
       */
      this.IO = new ServerIO({
         _4handsInstance: this,
         ...configs
      }, this);

      return this.IO;
   }

   /**
    * Prints to the console with the instance id tag as prefixer.
    * @param  {...any} args 
    */
   toConsole(...args) {
      console.log(`[${this.id}]`, ...args);
   }
}

module.exports = _4HandsAPI;
