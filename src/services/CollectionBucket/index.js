const Collection = require('./Collection');

class CollectionBucket extends Map {
   constructor (collections = [], database) {
      super();

      this._database = () => database;
      collections.map(coll => this.setCollection(coll));
   }

   get database() {
      return this._database();
   }

   initDB() {
      this.forEach(coll => coll.initDB());
   }

   toArray() {
      const array = [];

      this.forEach(coll => array.push(coll));
      return array;
   }

   getCollection(collectionName) {
      return this.get(collectionName);
   }

   setCollection(collection) {
      if (!collection || typeof collection !== 'object' || Array.isArray(collection)) {
         return;
      }

      if (this.isDuplicatedSymbol(collection.symbol)) {
         return;
      }

      if (collection instanceof Collection) {
         this.set(collection.name, collection);
      } else {
         const newCollection = new Collection(collection);
         this.set(newCollection.name, newCollection);
      }
   }
   
   isDuplicatedSymbol(symbol) {
      let isDup = false;

      this.forEach(coll => {
         if (coll.symbol === symbol) {
            isDup = true;
         }
      });

      return isDup;
   }

   toExport(options) {
      const { include = [], exclude = [] } = Object(options);
      const result = [];

      this.forEach(coll => {
         if (!exclude.length && include.find(name => coll.name === name)) {
            result.push(coll);
         }

         if (!include.length && !exclude.find(name => coll.name === name)) {
            result.push(coll);
         }
      });

      return result;
   }
}

module.exports = CollectionBucket;
