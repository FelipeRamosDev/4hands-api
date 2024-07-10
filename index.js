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
     * @param {Function} setup.database.onReady - On ready callback.
     * @param {Function} setup.database.onError - On error callback.
     * @param {string} [setup.database.hostURL='mongodb://0.0.0.0:27017/'] - The HOST url. Default is 'mongodb://0.0.0.0:27017/'.
    * @param {Object} setup.serverAPI - The server HTTP configurations.
     * @param {string} setup.serverAPI.API_SECRET - The API secret key for session encryption.
     * @param {number} setup.serverAPI.sessionCookiesMaxAge - Maximum age of session cookies in milliseconds. Default is 86400000.
     * @param {string} setup.serverAPI.staticPath - The path to static files.
     * @param {Function} setup.serverAPI.onReady - Callback function to be executed when the server starts listening.
     * @param {string} setup.serverAPI.jsonLimit - Limit of JSON requests. Default is '10mb'.
     * @param {boolean} setup.serverAPI.sessionResave - Flag indicating whether to save session data back to the session store. Default is true.
     * @param {boolean} setup.serverAPI.sessionSaveUninitialized - Flag indicating whether to save uninitialized sessions to the session store. Default is true.
     * @param {string} setup.serverAPI.keySSLPath - The path to the SSL key file.
     * @param {string} setup.serverAPI.certSSLPath - The path to the SSL certificate file.
     * @param {string} setup.serverAPI.FE_ORIGIN - The front-end host URL.
     * @param {number} setup.serverAPI.PORT - The port number on which the server will listen. Default is 80.
     * @param {string[]} setup.serverAPI.corsOrigin - Array with the allowed domains for CORS configuration. Default is ['http://localhost', 'https://localhost'].
     * @param {string[]} setup.serverAPI.httpEndpoints - The path to the endpoints to be created on initialization.
    * @param {Object} setup.redis - The redis database configurations.
     * @param {Object} setup.redis.clientOptions - The native 'redis' package options.
     * @param {Function} setup.redis.onConnect - Callback to when the client is connected to the Redis.
     * @param {Function} setup.redis.onReady - Callback to when the RedisService is ready to be used.
     * @param {Function} setup.redis.onEnd - Callback to when the client is closed.
     * @param {Function} setup.redis.onError - Callback to when the client got an error.
     * @param {Function} setup.redis.onReconnecting - Callback to when the client is reconnected to the Redis.
    * @param {Object} setup.socketIO - The socket server configurations.
     * @param {Object} setup.socketIO._4handsInstance - The main 4hands-api instance.
     * @param {string} setup.socketIO.path - The namespace path.
     * @param {number} setup.socketIO.port - The server port.
     * @param {Function[]} setup.socketIO.middlewares - The server/namespace middlewares.
     * @param {string[]} setup.socketIO.corsOrigin - The server cors policy.
     * @param {Function} setup.socketIO.onConnect - The callback for when the socket connection is concluded with success.
     * @param {Function} setup.socketIO.onData - The callback for when an 'message' event arrives.
     * @param {Function} setup.socketIO.onDisconnect - The callback for when the client disconnected.
     * @param {Function} setup.socketIO.onError - The callback for when an error is caught.
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
       * The instance name id.
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
      this.collections = new CollectionBucket(collections);
      this.collections.toBlend([ users, auth_buckets, safe_values ]);

      /**
       * Array with all async functions to init the services.
       * @type {Function[]}
       */
      this.toInit = [];

      try {
         (async () => {
            if (database) {
               await this.createDatabase(database);

               if (this.declareGlobal) {
                  global.CRUD = this.CRUD;
               }
            }

            if (redis) {
               await this.createRedis(redis);
            }
      
            if (emailService) {
               this.createEmailService(emailService);
            }
      
            if (serverAPI) {
               this.createServerAPI(serverAPI);

               if (this.declareGlobal) {
                  global.API = this.API;
               }
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
      } catch (err) {
         onError.call(this, err);
      }
   }

   /**
    * The CRUD object.
    * @type {CRUD}
    */
   get CRUD() {
      return this.DB?.CRUD;
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
      this.API = new ServerAPI({
         projectName: this.id,
         ...configs
      }, this);

      if (this.toInit) {
         this.toInit.push(this.API.init);
      }

      return this.API;
   }

   async createRedis(configs) {
      const RedisService = require('./src/services/Redis');

      if (typeof configs === 'boolean' && configs) {
         configs = {};
      }

      /**
       * The Redis service instance.
       * @type {RedisService}
       */
      this.Redis = new RedisService({
         collections: this.collections.toArray(),
         apiServer: this.API,
         ...configs
      }, this);

      await this.Redis.connect();
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
         corsOrigin: this.API?.corsOrigin,
         ssl: {
            keyPath: this.API?.keySSLPath,
            certPath: this.API?.certSSLPath
         },
         ...configs
      });

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
