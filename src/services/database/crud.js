const helpersModule = require('../../helpers');

const helpers = helpersModule.database.dbHelpers;

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
async function create(collectionName, data, options) {
    const { isDraft } = options || {};
    try {
        const Collection = helpers.getCollectionModel(collectionName);
        const newDoc = new Collection(data);
        
        newDoc.raw = data;
        if (isDraft) {
            return newDoc;
        }
    
        const savedDoc = await newDoc.save(options);
        return savedDoc;
    } catch(err) {
        throw new Error.Log(err).append('database.creating_document', collectionName);
    }
}

/**
 * Performs a query on the specified collection based on the provided filter and sort options.
 * @param {Object} setup - The query setup object.
 * @param {string} setup.collectionName - The name of the collection to query.
 * @param {Object} [setup.filter] - The filter criteria for the query.
 * @param {Object} [setup.sort] - The sort criteria for the query.
 * @returns {Query} The query result.
 * @throws {Error.Log} If the specified collection schema is not found or an error occurs during querying.
 */
function query(setup) {
    try {
        const schemas = API.database.collections;
        const {collectionName, filter, sort} = setup || {};
        const filterObj = helpers.treatFilter(filter || {});
        const Schema = schemas.find(item => item.name === collectionName);

        if (Schema) {
            const Collection = Schema.DB;

            if (!sort) {
                return Collection.find(filterObj);
            } else {
                return Collection.find(filterObj).sort(sort);
            }
        } else {
            throw new Error.Log('database.schema_not_found', collectionName);
        }
    } catch(err) {
        throw new Error.Log(err).append('database.querying_collection', setup.collectionName);
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
function getDoc(setup) {
    const {collectionName, filter} = setup || {};

    try {
        const schemas = API.database.collections;
        const filterObj = helpers.treatFilter(filter);
        const Schema = schemas.find(item => item.name === collectionName);
        const Collection = Schema && Schema.DB;

        if (Collection) {
            const Doc = Collection.findOne(filterObj);
            return Doc;
        } else {
            throw new Error.Log('database.getting_schema', collectionName);
        }
    } catch(err) {
        throw new Error.Log(err).append('database.getting_document', setup.collection, JSON.stringify(helpers.treatFilter(filter) || {}));
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
async function update(setup) {
    const {type, collectionName, filter, data, options} = setup || {};
    const {
        returnDocs, // boolean
        mongooseOpt // Object, same as mongoose options, check the mongoose documentation
    } = options || {};

    try {
        const updateType = helpers.pickQueryType(filter, type);
        const query = helpers.treatFilter(filter);
        const Collection = helpers.getCollectionModel(collectionName);

        switch (updateType) {
            case 'one': {
                try {
                    const updated = await Collection.findOneAndUpdate(query, data, mongooseOpt);

                    if (!updated) throw new Error.Log('database.updating_document', query)
                    if (returnDocs) return updated;
                    return { success: true };
                } catch(err) {
                    throw new Error.Log(err);
                }
            }
            case 'many': {
                try {
                    const docs = await Collection.find(query);
                    const updated = await Collection.updateMany(query, data, mongooseOpt);
    
                    if (returnDocs) return docs;
                    return updated;
                } catch(err) {
                    throw new Error.Log(err).append('database.updating_document', query);
                }
            }
        }
    } catch(err) {
        throw new Error.Log(err).append('database.updating_document', helpers.treatFilter(filter));
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
async function del(setup) {
    const {
        deleteType, // 'one' || 'many'
        collectionName, // 'CollectionName'
        filter, // '_id' || {mongoose-filter}
        options // mongoose options
    } = setup || {};

    try {
        const Collection = helpers.getCollectionModel(collectionName);
        const query = helpers.treatFilter(filter);
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

        return deleted;
    } catch(err) {
        throw new Error.Log(err).append('database.deleting_document', collectionName, JSON.stringify(filter));
    }
}

module.exports = {
    create,
    query,
    getDoc,
    update,
    del
};
