const dbHelpers = require('./dbHelpers');

async function readable(options) {
    const {
        // Futures options can be placed here
    } = options || {};

    try {
        const result = await this.exec();
        return result.map(doc => doc.toObject());
    } catch(err) {
        return new Error.Log(err).append('')
    }

};

function getUpdateProps() {
    const updateProps = {...this._update.$set};

    delete updateProps.modifiedAt;
    return updateProps;
}

function paginate(options) {
    let {
        views,
        page,
        seeMore
    } = options || {};

    try {
        if (views && !seeMore) this.limit(views);
        if (!page) page = 1;

        if (!seeMore) {
            this.options.skip = views * (page - 1);
        } else {
            if (views) this.limit(views * page);
        }

        return this;
    } catch(err) {
        throw new Error.Log(err).append('database.paginate_query');
    }
}

function populateAll(options) {
    try {
        let {
            select,
            exclude,
            levels
        } = options || {};
        const relFields = dbHelpers.findRelFields(this.schema, exclude, levels);
        let populated = this;

        relFields.map(field=>{
            const selection = select && select[field] && select[field].join(' ');
            populated = populated.populate(field);
        });
    
        return populated;
    } catch(err) {
        return new Error.Log(err).append('database.populating_document', this._collection.collectionName);
    }
}

async function initialize(populate){
    let docs;

    if (populate) {
        docs = await this.exec().defaultPopulate();
    } else {
        docs = await this.exec();
    }

    let result = [];

    try {
        if(Array.isArray(docs)) {
            docs.map(doc=>{
                const initialized = doc.initialize();
                result.push(initialized);
            });
        } else if (docs && docs.initialize) {
            result = docs.initialize();
        }
    } catch(err) {
        throw new Error.Log(err);
    }

    return result;
}

module.exports = {
    readable,
    paginate,
    populateAll,
    initialize,
    getUpdateProps
};
