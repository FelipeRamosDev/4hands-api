class GetQueryCollectionRes {
    constructor(result, body) {
        this.collection = body.collection;
        this.filter = body.filter || {};
        this.options = body.options || {};
        this.result = result || [];
        
        if (body.options && body.options.paginate) this.currentPage = body.options.page;
    }
}

module.exports = {
    response: GetQueryCollectionRes
};
