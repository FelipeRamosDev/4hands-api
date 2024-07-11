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
         if (order) {
            if (typeof order === 'boolean') {
               order = order ? 1 : -1;
            }
   
            this._options.sort = { [sortSet]: validateNumber(order) };
         } else {
            order = 1;
            this._options.sort = { [sortSet]: validateNumber(order) };
         }
      }

      return this;
   }

   limit(value) {
      const number = validateNumber(value);

      this._options.limit = number;
      return this;
   }

   paginate(currentPage = 0) {
      const number = validateNumber(currentPage);

      this._options.page = number;
      return this;
   }

   async getDoc() {
      try {
         
      } catch (err) {
         throw err;
      }
   }

   async getQuery() {
      try {
         
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

function validateNumber(value) {
   if (isNaN(value)) {
      throw new Error('The value provided should be a valid number.');
   }

   const number = Number(value);
   if (number % 1) {
      throw new Error('The value provided should be a valid integer but received a double.');
   }

   return number;
}

module.exports = DBQuery;
