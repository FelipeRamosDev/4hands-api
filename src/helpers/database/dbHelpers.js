const mongoose = require('mongoose');
const configs = require('@config');

function isCollectionExist(collection) {
    try {
        return mongoose.modelNames().find(model => model === collection);
    } catch(err) {
        throw new Error.Log('helpers.is_collection_exist', collection);
    }
}

function isDocExist(collectionName, filter) {
    return new Promise((resolve, reject) => {
        mongoose.model(collectionName).exists(filter, (err, res) => {
            if (err) {
                reject(new Error.Log(err));
            }

            resolve(res);
        });
    });

}

function getCollectionModel(collection) {
    try {
        if (isCollectionExist(collection)) {
            return mongoose.model(collection);
        } else {
            throw new Error.Log('database.collection_dont_exist', collection);
        }
    } catch(err) {
        throw new Error.Log(err).append('helpers.get_collection_model', collection);
    }
}

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
        throw new Error.Log(err).append('helpers.create_counter', collection.name);
    }
}

async function increaseCounter(collection) {
    try {
        const Counters = mongoose.model(configs.database.counterCollection);
        const counter = await Counters.findByIdAndUpdate(collection, { $inc: { value: 1 }});

        return counter.toObject();
    } catch(err) {
        throw new Error.Log(err).append('helpers.increase_counter', collection);
    }
}

async function increaseLog(logUID) {   
    try {
        const Logs = mongoose.model(configs.database.logCollection);
        const logCounter = await Logs.findByIdAndUpdate(logUID, { $inc: { groupedLogs: 1 }});

        return logCounter.toObject();
    } catch(err) {
        throw new Error.Log(err).append('helpers.increase_log');
    }
}

async function increaseDocProp(collectionName, filter, data) {   
    try {
        const DBModel = mongoose.model(collectionName);
        const doc = await DBModel.findOneAndUpdate(filter, { $inc: data });

        return doc.initialize();
    } catch(err) {
        throw new Error.Log(err).append('helpers.increase_doc_prop', collectionName, filter, data);
    }
}

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

function treatFilter(filter) {
    let query;

    try {
        if (Boolean.isValid(filter).stringFilled()){
            query = { _id: filter };
        } else if (Boolean.isValid(filter).object().eval()) {
            query = filter;
        } else {
            throw new Error.Log('common.bad_format_param',
                'filter',
                'treatFilter',
                ['String(ObjectId._id)', 'Object'],
                filter,
                'dbHelpers.js'
            );
        }
    } catch(err) {
        throw new Error.Log(err).append('helpers.treat_filter');
    }

    return query;
}

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
            return new Error.Log('common.missing_params', 'schema', 'findRelFields', 'dbHelpers.js');
        }
    } catch(err) {
        throw new Error.Log(err).append('helpers.find_rel_fields');
    }
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
    findRelFields
};
