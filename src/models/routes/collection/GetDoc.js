class GetDocRes {
    constructor(doc, body) {
        this.collection = body.collection;
        this.filter = body.filter || {};
        this.options = body.options;
        this.doc = doc;
    }
}

module.exports = {
    response: GetDocRes
};
