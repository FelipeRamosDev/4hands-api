const CRUD = require('@CRUD');

class GlobalClass {
    initialize() {
        try {
            const Model = this.BSModel || this?.schema?.statics?.BSModel;

            if (Model) {
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

    /**
     * @readonly
     * @returns {boolean} Return if the document is fully loaded
     */
    get isComplete() {
        return true;
    }

    /**
     * @readonly
     * @returns {string[]} The fields that needs to save as encrypted buffer.
     */
    get encryptedFields() {
        const result = [];

        Object.keys(this.schema.obj).map(key => {
            const curr = this.schema.obj[key];

            if (curr.isEncrypt) {
                result.push(key);
            }
        });

        return result;
    }
}

module.exports = GlobalClass;
