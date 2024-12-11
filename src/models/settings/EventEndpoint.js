const { logError } = require('4hands-api/src/models/ErrorLog');
const IORedis = require('ioredis');
const ioRedis = new IORedis();

/**
 * Represents an API endpoint configuration.
 * @class EventEndpoint
 * @namespace Models
 */
class EventEndpoint {
   /**
    * Creates a new instance of the EventEndpoint class.
    * @param {Object} setup - The setup object containing endpoint details and configurations.
    * @param {string} setup.root - The root path of the endpoint's route.
    * @param {string} setup.path - The path of the endpoint's route.
    * @param {function} setup.controller - The controller function handling the endpoint logic.
    * @throws {Error.Log} If setup parameters are invalid.
    */
   constructor(setup, instance) {
      const { root, path, controller } = Object(setup);

      // Validation checks for required parameters
      if (!path) {
         throw logError({
            name: 'ROUTE_REQUIRED',
            message: 'The "path" param is required to declare a new endpoint!'
         });
      }

      if (typeof controller !== 'function') {
         throw logError({
            name: 'CONTROLLER_REQUIRED',
            message: 'The "controller" param is required to be a function when declaring a new endpoint!'
         });
      }

      this._instance = () => instance;
      this.ioRedis = ioRedis;

      /**
       * The root path of the endpoint's route.
       * @type {string}
       */
      this.root = root;

      /**
       * The path of the endpoint's route.
       * @type {string}
       */
      this.path = path;

      /**
       * The controller function handling the endpoint logic.
       * @type {function}
       */
      this.controller = controller;

      // Subscribing the event
      this.ioRedis.subscribe(this.fullPath, (err) => {
         if (err) {
            logError({
               name: 'EVENT_ENDPOINT_SUBSCRIBE',
               message: 'Error on subscribing the event endpoint: ' + this.fullPath
            });
         } else {
            console.log(`Subscribed to event endpoint: ${this.fullPath}`);
         }
      });

      this.ioRedis.on('message', (channel, message) => {
         if (channel !== this.fullPath) {
            return;
         }

         try {
            const data = JSON.parse(message);
            this.controller.call(this, data);
         } catch (err) {
            logError(err);
         }
      });
   }

   /**
    * Retrieves the instance to which this route belongs.
    * @returns {InstanceBase} The instance associated with this route.
    */
   get instance() {
      return this._instance();
   }

   get fullPath() {
      return `${this.root ? this.root : ''}${this.path}`;
   }

   /**
    * Sets a new instance for this route.
    * @param {InstanceBase} instance - The new instance to associate with this route.
    */
   setInstance(instance) {
      this._instance = () => instance;
   }
}

module.exports = EventEndpoint;
