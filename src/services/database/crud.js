const helpersModule = require('../../helpers');

const helpers = helpersModule.database.dbHelpers;

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

function query(setup) {
    try {
        const schemas = require('../../schemas');
        const {collectionName, filter, sort} = setup || {};
        const filterObj = helpers.treatFilter(filter || {});
        const Schema = schemas[collectionName];

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

function getDoc(setup) {
    const {collectionName, filter} = setup || {};

    try {
        const schemas = require('../../schemas');
        const filterObj = helpers.treatFilter(filter);
        const Schema = schemas[collectionName];
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
