class UpdateDocumentRes {
    constructor(doc, collection) {
        this.collection = collection;

        if(doc.toObject) {
            this.updated = doc.toObject();
        } else {
            this.updated = doc;
        }
    }
}

module.exports = {
    response: UpdateDocumentRes
};
