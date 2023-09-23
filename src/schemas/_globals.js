const { ObjectId } = require('mongoose').SchemaTypes;

function getGlobalSchema(exclude) {
    const out = {...getGlobalSchema.standardGlobal};

    if (exclude && Array.isArray(exclude)) {
        exclude.map(prop=>{
            if (out[prop]) {
                delete out[prop];
            }
        });
    }

    return out;
}

getGlobalSchema.standardGlobal = {
    index: {
        type: Number,
        unique: true,
        immutable: true
    },
    cod: {
        type: String,
        unique: true,
        immutable: true
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: Date.now
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: ObjectId,
        immutable: true
    }
}

module.exports = {
    getGlobalSchema
};
