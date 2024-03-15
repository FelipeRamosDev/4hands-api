const dbHelpers = require('4hands-api/src/helpers/database/dbHelpers');

/**
 * A function to make query results readable by converting MongoDB documents to plain JavaScript objects.
 * @function
 * @async
 * @param {Object} options - Additional options for query results (not used in the function).
 * @returns {Array} - An array of plain JavaScript objects representing the query results.
 * @throws {Error} - Throws an error if there is an issue converting the documents.
 */
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

/**
 * Extracts the update properties from the current update operation object.
 * @function
 * @returns {Object} - An object containing the update properties to be applied to the document.
 */
function getUpdateProps() {
    const updateProps = {...this._update.$set};

    delete updateProps.modifiedAt;
    return updateProps;
}

/**
 * Paginates query results based on the provided options.
 * @function
 * @param {Object} options - Pagination options including 'views', 'page', and 'seeMore'.
 * @returns {Object} - The updated query object with pagination applied.
 * @throws {Error} - Throws an error if there is an issue with the pagination query.
 */
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

/**
 * Populates all specified relational fields in the query results.
 * @function
 * @param {Object} options - Population options including 'select', 'exclude', and 'levels'.
 * @returns {Object} - The updated query object with relational fields populated.
 * @throws {Error} - Throws an error if there is an issue populating relational fields.
 */
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

/**
 * Initializes query results by converting MongoDB documents to objects.
 * @function
 * @async
 * @param {boolean} populate - Flag indicating whether to populate related fields in the documents.
 * @returns {Array|Object} - An array of initialized objects or a single initialized object representing the query results.
 * @throws {Error} - Throws an error if there is an issue initializing the documents.
 */
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
