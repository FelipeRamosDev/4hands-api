const mongoose = require('mongoose');
const configs = require('4hands-api/configs/project');

/**
 * Checks if a collection exists in the MongoDB database.
 * @param {string} collection - The name of the collection to check.
 * @returns {string|undefined} - The name of the existing collection or undefined if the collection does not exist.
 * @throws {Error} - Throws an error if there is an issue accessing the database.
 */
function isCollectionExist(collection) {
    try {
        return mongoose.modelNames().find(model => model === collection);
    } catch(err) {
        throw logError('helpers.is_collection_exist', collection);
    }
}

/**
 * Checks if a document exists in a specific collection based on the provided filter.
 * @param {string} collectionName - The name of the collection to check.
 * @param {Object} filter - The filter object to search for the document.
 * @returns {Promise<boolean>} - A promise that resolves to true if the document exists, false otherwise.
 * @throws {Error} - Throws an error if there is an issue accessing the database.
 */
async function isDocExist(collectionName, filter) {
    try {
        return await mongoose.model(collectionName).exists(filter);
    } catch (err) {
        return;   
    }
}

/**
 * Retrieves the Mongoose model for a given collection name.
 * @param {string} collection - The name of the collection to retrieve the model for.
 * @returns {Model} - The Mongoose model for the specified collection.
 * @throws {Error} - Throws an error if the collection does not exist.
 */
function getCollectionModel(collection) {
    try {
        if (isCollectionExist(collection)) {
            return mongoose.model(collection);
        } else {
            throw logError('database.collection_dont_exist', collection);
        }
    } catch(err) {
        throw logError(err);
    }
}

/**
 * Creates a counter document for a specific collection if it does not already exist.
 * @param {Object} collection - The collection object containing 'name' and 'symbol' properties.
 * @throws {Error} - Throws an error if there is an issue creating the counter document.
 */
async function createCounter(collection){
    try {
        const Counters = mongoose.model(configs.database.counterCollection);
        const collCounter = await Counters.findById(collection.name);

        if (!collCounter) {
            const newCounter = new Counters({
                _id: collection.name,
                symbol: collection.symbol
            });

            await newCounter.save();
        }
    } catch(err) {
        throw logError(err);
    }
}

/**
 * Increases the counter value for a specific collection and returns the updated counter object.
 * @param {string} collection - The name of the collection to increase the counter for.
 * @returns {Object} - The updated counter object.
 * @throws {Error} - Throws an error if there is an issue increasing the counter.
 */
async function increaseCounter(collection) {
    try {
        const Counters = mongoose.model(configs.database.counterCollection);
        const counter = await Counters.findByIdAndUpdate(collection, { $inc: { value: 1 }});

        return counter.toObject();
    } catch(err) {
        throw logError(err);
    }
}

/**
 * Increases the 'groupedLogs' property of a specific log document and returns the updated log object.
 * @param {string} logUID - The unique identifier of the log document to increase the property for.
 * @returns {Object} - The updated log object.
 * @throws {Error} - Throws an error if there is an issue increasing the log property.
 */
async function increaseLog(logUID) {   
    try {
        const Logs = mongoose.model(configs.database.logCollection);
        const logCounter = await Logs.findByIdAndUpdate(logUID, { $inc: { groupedLogs: 1 }});

        return logCounter.toObject();
    } catch(err) {
        throw logError(err);
    }
}

/**
 * Increases specified properties of a document based on the provided filter and data object.
 * @param {string} collectionName - The name of the collection to update the document in.
 * @param {Object} filter - The filter object to match the document.
 * @param {Object} data - The data object containing properties to be incremented.
 * @returns {Object} - The updated document object.
 * @throws {Error} - Throws an error if there is an issue updating the document properties.
 */
async function increaseDocProp(collectionName, filter, data) {   
    try {
        const DBModel = mongoose.model(collectionName);
        const doc = await DBModel.findOneAndUpdate(filter, { $inc: data });

        return doc.initialize();
    } catch(err) {
        throw logError(err);
    }
}

/**
 * Determines the type of query based on the provided filter and the desired query type.
 * @param {*} filter - The filter object to analyze.
 * @param {string} type - The desired query type ('one' for single document, 'many' for multiple documents).
 * @returns {string} - The determined query type ('one' or 'many').
 */
function pickQueryType(filter, type) {
    let filterType = typeof filter;

    if (filterType === 'string') return 'one';
    if (filterType === 'object' && !Array.isArray(filter)) {
        switch(type) {
            case 'many': {
                return 'many';
            }
            case 'one':
            default: {
                return 'one';
            }
        }
    }

    return 'one';
}

/**
 * Validates and transforms a filter object to a format suitable for querying the database.
 * @param {string|Object} filter - The filter to be validated and transformed.
 * @returns {Object} - The transformed filter object suitable for database queries.
 * @throws {Error} - Throws an error if the filter is invalid.
 */
function treatFilter(filter) {
    let query;

    try {
        if (Boolean.isValid(filter).stringFilled()){
            query = { _id: filter };
        } else if (Boolean.isValid(filter).object().eval()) {
            query = filter;
        } else {
            throw logError('common.bad_format_param',
                'filter',
                'treatFilter',
                ['String(ObjectId._id)', 'Object'],
                filter,
                'dbHelpers.js'
            );
        }
    } catch(err) {
        throw logError(err);
    }

    return query;
}

/**
 * Finds and returns fields in a Mongoose schema that are references to other schemas.
 * @param {Object} schema - The Mongoose schema object to search for related fields.
 * @param {Array} exclude - An array of field names to exclude from the result.
 * @param {number} levels - The number of levels to search for related fields (default is 1).
 * @param {number} currentLevel - The current level of recursion (default is 1).
 * @returns {Array} - An array of objects representing related fields and their respective schemas.
 * @throws {Error} - Throws an error if there is an issue analyzing the schema.
 */
function findRelFields(schema, exclude, levels, currentLevel) {
    if (!levels) levels = 1;
    if (!currentLevel) currentLevel = 1;
    let result = [];

    if ((currentLevel + 1) > levels) return result

    try {
        if (schema) {
            Object.keys(schema.obj || {}).map(key=>{
                const curr = schema.obj[key] || {};
                const typeOf = curr.type && curr.type.schemaName || typeof curr.type; 
                const isExclude = (!exclude || !exclude.find(x => x === key));
                const refSchema = curr.ref && mongoose.model(curr.ref).schema;
                
                if (Array.isArray(curr.type)) {
                    const type = curr.type.find(x => x.schemaName === 'ObjectId')
                    if (type && isExclude && refSchema) result.push({
                        path: key, 
                        populate: findRelFields(refSchema, exclude, levels, ++currentLevel)
                    });
                }
                else if (typeOf === 'ObjectId' && isExclude){
                    result.push({
                        path: key,
                        model: curr.ref,
                        populate: currentLevel < levels ? findRelFields(refSchema, exclude, levels, ++currentLevel) : undefined
                    });
                }
                else if (typeOf === 'object' && isExclude) {
                    const subRels = findRelFields({obj: curr.type}, exclude, levels, ++currentLevel);
                    result.push({path: key, populate: subRels});
                }
            });
    
            return result;
        } else {
            return logError('common.missing_params', 'schema', 'findRelFields', 'dbHelpers.js');
        }
    } catch(err) {
        throw logError(err);
    }
}

/**
 * Encrypts specified fields in the given context object and adds encrypted values to the context of Mongoose Event.
 *
 * @param {Object} context - The context object containing data and encryptedFields property coming for the Mongoose Event.
 * @returns {Object} Updated context object with encrypted fields.
 * @throws {Error} If there's an error during encryption, it is caught and logged.
 * @async
 */
async function createEncryptFields(context) {
    const SafeValue = require('4hands-api/src/models/collections/SafeValue');

    for (let key of context.encryptedFields) {
        const rawValue = context.raw['_' + key];

        if (rawValue) {
            context[key] = await SafeValue.createEncrypt(rawValue);
        }
    }

    return context;
}

module.exports = {
    createCounter,
    increaseCounter,
    increaseLog,
    increaseDocProp,
    isCollectionExist,
    isDocExist,
    getCollectionModel,
    pickQueryType,
    treatFilter,
    findRelFields,
    createEncryptFields
};
