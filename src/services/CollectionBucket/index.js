const Collection = require('./Collection');
const CollectionEncrypt = require('./CollectionEncrypt');
const CollectionField = require('./CollectionField');

class CollectionBucket extends Map {
   /**
    * @class
    */
   static Collection = Collection;

   /**
    * @class
    */
   static CollectionEncrypt = CollectionEncrypt;

   /**
    * @class
    */
   static CollectionField = CollectionField;

   /**
    * Constructs a new CollectionBucket instance.
    * @param {Array} collections - An array of collections to initialize the bucket with.
    * @param {Object} database - The database instance associated with the collections.
    */
   constructor(collections = [], database) {
      super();

      this._database = () => database;
      collections.map(coll => this.setCollection(coll));
   }

   /**
    * Gets the database associated with the collections.
    * @returns {Object} - The database instance.
    */
   get database() {
      return this._database();
   }

   /**
    * Initializes the database for each collection in the bucket.
    */
   initDB() {
      this.forEach(coll => coll.initDB());
   }

   /**
    * Converts the collections in the bucket to an array.
    * @returns {Array} - An array of collections.
    */
   toArray() {
      const array = [];

      this.forEach(coll => array.push(coll));
      return array;
   }

   /**
    * Retrieves a collection by its name.
    * @param {string} collectionName - The name of the collection to retrieve.
    * @returns {Collection} - The collection with the specified name.
    */
   getCollection(collectionName) {
      return this.get(collectionName);
   }

   /**
    * Adds a collection to the bucket.
    * @param {Object|Collection} collection - The collection object or instance to add.
    */
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
   
   /**
    * Checks if a symbol is duplicated in the bucket.
    * @param {string} symbol - The symbol to check for duplication.
    * @returns {boolean} - True if the symbol is duplicated, false otherwise.
    */
   isDuplicatedSymbol(symbol) {
      let isDup = false;

      this.forEach(coll => {
         if (coll.symbol === symbol) {
            isDup = true;
         }
      });

      return isDup;
   }

   /**
    * Exports collections based on include and exclude options.
    * @param {Object} options - The options object containing include and exclude arrays.
    * @returns {Array} - An array of collections to be exported.
    */
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
   
   /**
    * Blends collections with the existing collections in the bucket.
    * @param {Array} collections - An array of collections to blend.
    */
   toBlend(collections) {
      collections.map(coll => {
         const collection = this.getCollection(coll.name);

         if (collection) {
            collection.blend(coll);
         } else {
            this.setCollection(coll);
         }
      });
   }
}

module.exports = CollectionBucket;
