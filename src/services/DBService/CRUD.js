const { dbHelpers } = require('4hands-api/src/helpers/database');

/**
 * Instance to make CRUD operations (create, read, update, delete)
 * @class CRUD
 */
class CRUD {
    constructor (database, options) {
        const {  } = Object(options);

        this._database = () => database;
    }

    get database() {
        return this._database();
    }

    /**
     * Creates a new document in the specified collection.
     * @async
     * @param {string} collectionName - The name of the collection to create the document in.
     * @param {Object} data - The data to be added to the document.
     * @param {Object} [options] - Additional options for document creation.
     * @param {boolean} [options.isDraft] - Indicates if the document is a draft.
     * @returns {Promise<Object>} The created document or a draft object, if specified.
     * @throws {Error.Log} If an error occurs during document creation.
     */
    async create(collectionName, data, options) {
        const { isDraft } = Object(options);

        try {
            const Collection = dbHelpers.getCollectionModel(collectionName);
            const newDoc = new Collection(data);
            
            newDoc.raw = data;
            if (isDraft) {
                return newDoc;
            }
        
            const savedDoc = await newDoc.save(options);
            return savedDoc;
        } catch(err) {
            throw logError(err);
        }
    }
    
    /**
     * Performs a query on the specified collection based on the provided filter and sort options.
     * @param {Object} setup - The query setup object.
     * @param {string} setup.collectionName - The name of the collection to query.
     * @param {Object} setup.filter - The filter criteria for the query.
     * @param {string} setup.sort - The sort criteria for the query.
     * @param {number} setup.limit - The limit value for the search.
     * @param {number} setup.page - The page number.
     * @returns {Query} The query result.
     * @throws {Error.Log} If the specified collection schema is not found or an error occurs during querying.
     */
    query(setup) {
        try {
            const { collectionName, filter, sort, limit, page = 1 } = Object(setup);
            const filterObj = dbHelpers.treatFilter(filter || {});
            const Schema = this.database.getCollection(collectionName);

            if (Schema) {
                const Collection = Schema.DB;
                let query = Collection.find(filterObj);

                if (sort) {
                    query.sort(sort);
                }

                if (limit && !isNaN(limit)) {
                    query.skip((Number(page) - 1) * limit).limit(Number(limit));
                }

                return query;
            } else {
                throw logError('database.schema_not_found', collectionName);
            }
        } catch(err) {
            throw logError(err);
        }
    }
    
    /**
     * Retrieves a single document from the specified collection based on the provided filter.
     * @param {Object} setup - The setup object for retrieving the document.
     * @param {string} setup.collectionName - The name of the collection to retrieve the document from.
     * @param {Object} [setup.filter] - The filter criteria for retrieving the document.
     * @returns {Object|null} The retrieved document or null if no document is found.
     * @throws {Error.Log} If the specified collection schema is not found or an error occurs during document retrieval.
     */
    getDoc(setup) {
        const { collectionName, filter } = Object(setup);

        try {
            const filterObj = dbHelpers.treatFilter(filter);
            const Schema = this.database.getCollection(collectionName);
            const Collection = Schema && Schema.DB;

            if (Collection) {
                const Doc = Collection.findOne(filterObj);
                return Doc;
            } else {
                throw logError('database.getting_schema', collectionName);
            }
        } catch(err) {
            throw logError(err);
        }
    }
    
    /**
     * Updates documents in the specified collection based on the provided filter and update data.
     * @async
     * @param {Object} setup - The update setup object.
     * @param {string} setup.type - The type of update ('one' or 'many').
     * @param {string} setup.collectionName - The name of the collection to update documents in.
     * @param {Object} setup.filter - The filter criteria for updating documents.
     * @param {Object} setup.data - The update data for the documents.
     * @param {Object} [setup.options] - Additional options for the update operation.
     * @param {boolean} [setup.options.returnDocs] - Indicates whether to return the updated documents.
     * @param {Object} [setup.options.mongooseOpt] - Mongoose options for the update operation.
     * @returns {Promise<Object|Array<Object>>} The updated document(s) or success status, based on the update type and options.
     * @throws {Error.Log} If an error occurs during document update.
     */
    async update(setup) {
        const {type, collectionName, filter, data, options} = Object(setup);
        const {
            returnDocs, // boolean
            mongooseOpt // Object, same as mongoose options, check the mongoose documentation
        } = options || {};

        try {
            const updateType = dbHelpers.pickQueryType(filter, type);
            const query = dbHelpers.treatFilter(filter);
            const Collection = dbHelpers.getCollectionModel(collectionName);

            switch (updateType) {
                case 'one': {
                    try {
                        const updated = await Collection.findOneAndUpdate(query, data, mongooseOpt);

                        if (!updated) throw toError('database.updating_document', query);
                        if (returnDocs) return updated;
                        return { success: true };
                    } catch(err) {
                        throw logError(err);
                    }
                }
                case 'many': {
                    try {
                        const docs = await Collection.find(query);
                        const updated = await Collection.updateMany(query, data, mongooseOpt);

                        if (returnDocs) return docs;
                        return updated;
                    } catch(err) {
                        throw logError(err);
                    }
                }
            }
        } catch(err) {
            throw logError(err);
        }
    }

    /**
     * Updates multiple documents in the specified collection.
     * @async
     * @param {Object} params - The parameters for the update operation.
     * @param {string} params.collectionName - The name of the collection to update documents in.
     * @param {Object} params.filter - The filter criteria to select documents for updating.
     * @param {Object} params.data - The update data to be applied to the selected documents.
     * @param {Object} [mongooseOptions] - Additional options for the Mongoose updateMany operation.
     * @returns {Promise<Object>} An object indicating success or containing error information if the update fails.
     * @throws {Error.Log} If an error occurs during the update operation.
     */
    async updateMany(params, mongooseOptions) {
        const { collectionName, filter, data } = Object(params);

        try {
            const queryFilter = dbHelpers.treatFilter(filter);
            const Collection = dbHelpers.getCollectionModel(collectionName);
            const updated = await Collection.updateMany(queryFilter, data, mongooseOptions);

            if (updated.acknowledged) {
                return { success: true };
            }

            return toError({
                name: 'DB_UPDATE_MANY',
                message: `The documents couldn't be updated! Error caugth when updating many at "CRUD.updateMany".`
            });
        } catch (err) {
            throw logError(err);
        }
    }
    
    /**
     * Deletes documents from the specified collection based on the provided filter and delete type.
     * @async
     * @param {Object} setup - The delete setup object.
     * @param {string} setup.deleteType - The delete type ('one' or 'many').
     * @param {string} setup.collectionName - The name of the collection to delete documents from.
     * @param {string|Object} setup.filter - The filter criteria for deleting documents.
     * @param {Object} [setup.options] - Additional options for the delete operation.
     * @returns {Promise<Object>} The delete result.
     * @throws {Error.Log} If an error occurs during document deletion.
     */
    async del(setup) {
        const {
            deleteType, // 'one' || 'many'
            collectionName, // 'CollectionName'
            filter, // '_id' || {mongoose-filter}
            options // mongoose options
        } = Object(setup);

        try {
            const Collection = dbHelpers.getCollectionModel(collectionName);
            const query = dbHelpers.treatFilter(filter);
            let deleted;

            switch(deleteType || 'one'){
                case 'many': {
                    deleted = await Collection.deleteMany(query, options);
                    break;
                }
                case 'one':
                default: {
                    deleted = await Collection.deleteOne(query, options);
                }
            }

            return { success: deleted.acknowledged };
        } catch(err) {
            throw logError(err);
        }
    }
}

/**
 * Module providing CRUD (Create, Read, Update, Delete) operations for interacting with a database.
 * @module CRUD
 * @namespace Services
 */
module.exports = CRUD;
