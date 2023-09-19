const CRUD = require('@CRUD');

class GlobalClass {
    initialize() {
        try {
            const Model = this.schema && this.schema.statics && this.schema.statics.Model;
            if(Model) {
                const builded = new Model(this.toObject());
                return builded;
            } else {
                return this;
            }
        } catch(err) {
            throw new Error.Log(err).append('database.init_document', this.collection.collectionName, this.id);
        }
    }

    async defaultPopulate() {
        try {
            const docQuery = CRUD.getDoc({collectionName: this.collection.collectionName, filter: this.id });
            
            if (docQuery.defaultPopulate) {
                const docPopulated = await docQuery.defaultPopulate();
                if (docPopulated instanceof Error.Log) {
                    throw docPopulated;
                }

                if (docPopulated) {
                    return docPopulated;
                } else {
                    return null;
                }
            } else {
                return new Error.Log({
                    name: 'MONGOOSE-QUERY-NOT-FOUND',
                    message: `The mongoose custom query "defaultPopulate" don't exist!`
                });
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    get isComplete() {
        return true;
    }
}

module.exports = GlobalClass;
