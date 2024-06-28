/**
 * The main class to be declared to use the 4hands-api.
 * @class _4HandsAPI
 */
class _4HandsAPI {
   /**
    * @constructor
    * @param {Object} setup - Constructor params
    * @param {string} [setup.id="4hands-api"] - the id for the instance.
    * @param {Collection[]} setup.collections - Array of Collection objects with the collections declared.
    * @param {DatabaseServer} setup.database - The database configurations.
    * @param {ServerAPI} setup.serverAPI - The server HTTP configurations.
    * @param {RedisService} setup.redis - The redis database configurations.
    * @param {SocketIO} setup.socketIO - The socket server configurations.
    * @param {MailService} setup.emailService - The email service configurations.
    */
   constructor(setup) {
      const {
         database,
         serverAPI,
         redis,
         socketIO,
         emailService,
         id = '4hands-api',
         onReady = () => {},
         onError = (err) => { throw err; },
         collections = []
      } = Object(setup);

      /**
       * The instance name.
       * @type {string}
       */
      this.id = id;

      /**
       * The collections for the instance.
       * @type {Map}
       */
      this.collections = new Map;
      collections.map(item => this.collections.set(item.name, item));

      /**
       * Array with all async functions to init the services.
       * @type {Function[]}
       */
      this.toInit = [];

      if (redis) {
         this.createRedis(redis);
      }

      if (emailService) {
         this.createEmailService(emailService);
      }

      if (database) {
         this.createDatabase(database);
      }

      if (serverAPI) {
         this.createServerAPI(serverAPI);
      }

      if (socketIO) {
         this.createSocketServer(socketIO);
      }

      Promise.all(this.toInit).then(() => {
         onReady.call(this, this);
      }).catch(err => {
         onError.call(this, err);
      }).finally(() => {
         delete this.toInit;
      });
   }

   createDatabase(configs) {
      const Database = require('4hands-api/src/services/Database/DatabaseServer');

      /**
       * The database instance.
       * @type {Database}
       */
      this.DB = new Database({
         collections: this.collections,
         ...configs
      }, this);

      if (this.toInit) {
         this.toInit.push(async () => {
            return await new Promise((resolve, reject) => {
               this.DB.init({ success: resolve, error: reject });
            });
         });
      }

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
      const SocketIO = require('./src/services/ServerIO');

      /**
       * The socket server instance.
       * @type {SocketIO}
       */
      this.IO = new SocketIO({
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
