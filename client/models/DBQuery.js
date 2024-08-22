/**
 * Class representing a database query.
 * @class
 */
class DBQuery {
   /**
    * Create a database query.
    * @param {string} collection - The name of the collection.
    * @param {string|Object} filter - The filter criteria.
    * @param {_4HandsAPIClient} mainInstance - The main instance.
    * @throws Will throw an error if the collection is not provided.
    */
   constructor (collection, filter, mainInstance) {
      this._options = {};
      this._mainInstance = () => mainInstance;

      if (!collection) {
         throw new Error('The param "collection" is required to subscribe a document!');
      }

      if (typeof filter === 'string') {
         this.docUID = filter;
      }

      else if (filter && typeof filter === 'object' && !Array.isArray(filter)) {
         this.filter = filter;
      }

      this.collection = collection;
   }

   /**
    * Get the main instance.
    * @returns {Object} The main instance.
    */
   get main() {
      return this._mainInstance();
   }

   /**
    * Get the options.
    * @returns {Object} The options.
    */
   get options() {
      if (Object.keys(this._options).length) {
         return this._options;
      }
   }

   /**
    * Get the subscription document body.
    * @returns {Object} The subscription document body.
    */
   get subscribeDocBody() {
      const result = {
         type: 'doc',
         collection: this.collection
      };

      if (this.docUID) {
         result.docUID = this.docUID;
      } else if (this.filter) {
         result.filter = this.filter;
      }

      return result;
   }

   /**
    * Get the subscription query body.
    * @returns {Object} The subscription query body.
    */
   get subscribeQueryBody() {
      const result = {
         type: 'query',
         collection: this.collection
      };

      if (this.docUID) {
         result.filter = { _id: this.docUID };
      } else if (this.filter) {
         result.filter = this.filter;
      }

      if (this.options) {
         result.options = this.options;
      }

      return result;
   }

   /**
    * Sort the results.
    * @param {Object|string} sortSet - The sort set or key.
    * @param {boolean|number} order - The sort order.
    * @returns {DBQuery} The instance of DBQuery.
    * @throws Will throw an error if the sortSet is not provided.
    */
   sort(sortSet, order) {
      if (!sortSet) {
         throw new Error('The "sortOrder" param is required!');
      }

      if (sortSet && typeof sortSet === 'object' && !Array.isArray(sortSet)) {
         this._options.sort = sortSet;
      }

      else if (typeof sortSet === 'string') {
         if (typeof order === 'boolean') {
            order = order ? 1 : -1;
         } else if (!order) {
            order = 1;
         }

         const orderNum = this.main.utils.validateInteger(order);
         this._options.sort = { [sortSet]: orderNum };
      }

      return this;
   }

   /**
    * Limit the number of results.
    * @param {number} value - The limit value.
    * @returns {DBQuery} The instance of DBQuery.
    */
   limit(value) {
      const number = this.main.utils.validateInteger(value);

      this._options.limit = number;
      return this;
   }

   /**
    * Paginate the results.
    * @param {number} [currentPage=0] - The current page number.
    * @returns {DBQuery} The instance of DBQuery.
    */
   paginate(currentPage = 0) {
      const number = this.main.utils.validateInteger(currentPage);

      this._options.page = number;
      return this;
   }

   /**
    * Set the populate method.
    * @param {string} methodName - The method name.
    * @returns {DBQuery} The instance of DBQuery.
    * @throws Will throw an error if the methodName is not a string.
    */
   populateMethod(methodName) {
      if (typeof methodName !== 'string') {
         throw new Error('The param "methodName" should be a string!');
      }

      this._options.populateMethod = methodName;
      return this;
   }

   /**
    * Save a document.
    * @param {Object} data - The document data.
    * @returns {Promise<Object>} The saved document data.
    * @throws Will throw an error if the save operation fails.
    */
   async saveDoc(data) {
      const params = {
         collectionName: this.collection,
         options: this.options,
         data
      };

      try {
         const saved = await this.main.ajax.authPut('/collection/create', params);
         return saved;
      } catch (err) {
         throw err;
      }
   }

   /**
    * Get a document.
    * @returns {Promise<Object>} The document data.
    * @throws Will throw an error if the get operation fails.
    */
   async getDoc() {
      try {
         const response = await this.main.ajax.authGet('/collection/get/doc', {
            collectionName: this.collection,
            filter: this.docUID || this.filter,
            options: this.options
         });

         return response;
      } catch (err) {
         throw err;
      }
   }

   /**
    * Get a query result.
    * @returns {Promise<Object>} The query result data.
    * @throws Will throw an error if the get operation fails.
    */
   async getQuery() {
      try {
         const response = await this.main.ajax.authGet('/collection/get/query', {
            collectionName: this.collection,
            filter: this.docUID || this.filter,
            options: this.options
         });

         return response;
      } catch (err) {
         throw err;
      }
   }

   /**
    * Update a document.
    * @param {Object} data - The document data to update.
    * @returns {Promise<Object>} The updated document data.
    * @throws Will throw an error if the update operation fails.
    */
   async updateDoc(data) {
      try {
         const response = await this.main.ajax.authPost('/collection/update', {
            type: 'one',
            collectionName: this.collection,
            filter: this.docUID || this.filter,
            options: this.options,
            data
         });

         return response;
      } catch (err) {
         throw err;
      }
   }

   /**
    * Update multiple documents.
    * @param {Object} data - The documents data to update.
    * @returns {Promise<Object>} The updated documents data.
    * @throws Will throw an error if the update operation fails.
    */
   async updateMany(data) {
      try {
         const response = await this.main.ajax.authPost('/collection/update', {
            type: 'many',
            collectionName: this.collection,
            filter: this.docUID || this.filter,
            options: this.options,
            data
         });

         return response;
      } catch (err) {
         throw err;
      }
   }

   /**
    * Delete a document.
    * @returns {Promise<Object>} The deleted document data.
    * @throws Will throw an error if the delete operation fails.
    */
   async deleteDoc() {
      try {
         const response = await this.main.ajax.authDelete('/collection/delete', {
            deleteType: 'one',
            collectionName: this.collection,
            filter: this.docUID || this.filter,
            options: this.options
         });

         return response;
      } catch (err) {
         throw err;
      }
   }

   /**
    * Delete multiple documents.
    * @returns {Promise<Object>} The deleted documents data.
    * @throws Will throw an error if the delete operation fails.
    */
   async deleteMany() {
      try {
         const response = await this.main.ajax.authDelete('/collection/delete', {
            deleteType: 'many',
            collectionName: this.collection,
            filter: this.docUID || this.filter,
            options: this.options
         });

         return response;
      } catch (err) {
         throw err;
      }
   }

   /**
    * Subscribe to document changes.
    * @param {Object} callbacks - The callback functions.
    * @param {function} callbacks.onData - The callback function for data.
    * @param {function} callbacks.onError - The callback function for errors.
    * @returns {Object} The subscription socket.
    */
   subscribeDoc(callbacks) {
      const subSocket = this.main.getSocket('subscription');
      const {
         onData = () => {},
         onError = (err) => { throw err }
      } = Object(callbacks);

      try {
         if (subSocket) {
            subSocket.sendTo('subscribe', this.subscribeDocBody, (res) => {
               if (res?.error || !res?.id) {
                  onError.call(this, res);
               }

               subSocket.listenTo(res?.id, (snapshot) => {
                  onData.call(this, snapshot);
               });
            });
         } else {
            onError.call(this, {
               error: true,
               message: 'The socket "/subscribe-changes" is not connected!'
            });
         }

         return subSocket;
      } catch (err) {
         onError.call(this, err);
      }
   }

   /**
    * Subscribe to query changes.
    * @param {Object} callbacks - The callback functions.
    * @param {function} callbacks.onData - The callback function for data.
    * @param {function} callbacks.onError - The callback function for errors.
    * @returns {Object} The subscription socket.
    */
   subscribeQuery(callbacks) {
      const subSocket = this.main.getSocket('subscription');
      const {
         onData = () => {},
         onError = (err) => { throw err }
      } = Object(callbacks);

      try {
         if (subSocket) {
            subSocket.sendTo('subscribe', this.subscribeQueryBody, (res) => {
               if (res?.error || !res?.id) {
                  onError.call(this, res);
               }

               subSocket.listenTo(res?.id, (snapshot) => {
                  onData.call(this, snapshot);
               });
            });
         } else {
            onError.call(this, {
               error: true,
               message: 'The socket "/subscribe-changes" is not connected!'
            });
         }

         return subSocket;
      } catch (err) {
         onError.call(this, err);
      }
   }
}

module.exports = DBQuery;
