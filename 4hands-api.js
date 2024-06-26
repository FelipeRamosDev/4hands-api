/**
 * The main class to be declared to use the 4hands-api.
 * @class _4HandsAPI
 */
class _4HandsAPI {
   /**
    * @constructor
    * @param {Object} setup - Constructor params
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
         collections = []
      } = Object(setup);

      /**
       * The collections for the instance.
       * @property {Collection[]}
       */
      this.collections = collections;

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
   }

   createDatabase(configs, success, error) {
      const Database = require('./src/services/database/DatabaseServer');

      /**
       * The database instance.
       * @property {Database}
       */
      this.DB = new Database({
         collections: this.collections,
         ...configs
      }, this);

      this.DB.init({ success, error });
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
       * @property {ServerAPI}
       */
      this.API = new ServerAPI(configs, this);

      this.API.init();
      return this.API;
   }

   createRedis(configs) {
      const RedisService = require('./src/services/Redis');

      /**
       * The Redis service instance.
       * @property {RedisService}
       */
      this.Redis = new RedisService({
         collections: this.collections,
         ...configs
      }, this);

      return this.Redis;
   }

   createSocketServer(configs) {
      const SocketIO = require('./src/services/ServerIO');

      /**
       * The socket server instance.
       * @property {SocketIO}
       */
      this.IO = new SocketIO({
         _4handsInstance: this,
         ...configs
      }, this);

      return this.IO;
   }
}

module.exports = _4HandsAPI;
