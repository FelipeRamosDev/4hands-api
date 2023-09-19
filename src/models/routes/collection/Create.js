class CreateRes {
    constructor(doc) {
        const parsed = doc.toObject();
        
        this.collection = doc.collection.collectionName;
        this.createdDoc = {};

        for (let key in parsed) {
            this.createdDoc[key] = parsed[key];
        }
    }
}

module.exports = {
    response: CreateRes
};
