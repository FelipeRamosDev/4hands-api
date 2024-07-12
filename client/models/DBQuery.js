class DBQuery {
   constructor (collection, filter, mainInstance) {
      this._options = {}
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

   get main() {
      return this._mainInstance();
   }

   get options() {
      if (Object.keys(this._options).length) {
         return this._options;
      }
   }

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

   limit(value) {
      const number = this.main.utils.validateInteger(value);

      this._options.limit = number;
      return this;
   }

   paginate(currentPage = 0) {
      const number = this.main.utils.validateInteger(currentPage);

      this._options.page = number;
      return this;
   }

   populateMethod(methodName) {
      if (typeof methodName !== 'string') {
         throw new Error('The param "methodName" should be a string!');
      }

      this._options.populateMethod = methodName;
      return this;
   }

   async saveDoc(data) {
      const params = {
         collectionName: this.collection,
         options: this.options,
         data
      };

      try {
         const saved = await this.main.ajax.authPut('/collection/create', params);
         return saved?.data;
      } catch (err) {
         throw err;
      }
   }

   async getDoc() {
      try {
         const response = await this.main.ajax.authGet('/collection/get/doc', {
            collectionName: this.collection,
            filter: this.docUID || this.filter,
            options: this.options
         });

         return response?.data;
      } catch (err) {
         throw err;
      }
   }

   async getQuery() {
      try {
         const response = await this.main.ajax.authGet('/collection/get/query', {
            collectionName: this.collection,
            filter: this.docUID || this.filter,
            options: this.options
         });

         return response?.data;
      } catch (err) {
         throw err;
      }
   }

   async updateDoc(data) {
      try {
         const response = await this.main.ajax.authPost('/collection/update', {
            type: 'one',
            collectionName: this.collection,
            filter: this.docUID || this.filter,
            options: this.options,
            data
         });

         return response?.data;
      } catch (err) {
         throw err;
      }
   }

   async updateMany(data) {
      try {
         const response = await this.main.ajax.authPost('/collection/update', {
            type: 'many',
            collectionName: this.collection,
            filter: this.docUID || this.filter,
            options: this.options,
            data
         });

         return response?.data;
      } catch (err) {
         throw err;
      }
   }

   async deleteDoc() {
      try {
         const response = await this.main.ajax.authDelete('/collection/delete', {
            deleteType: 'one',
            collectionName: this.collection,
            filter: this.docUID || this.filter,
            options: this.options
         });

         return response?.data;
      } catch (err) {
         throw err;
      }
   }

   async deleteMany() {
      try {
         const response = await this.main.ajax.authDelete('/collection/delete', {
            deleteType: 'many',
            collectionName: this.collection,
            filter: this.docUID || this.filter,
            options: this.options
         });

         return response?.data;
      } catch (err) {
         throw err;
      }
   }

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
                  onError.call(this, err);
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
                  onError.call(this, err);
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
