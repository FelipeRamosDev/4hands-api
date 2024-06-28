const CRUD = require('4hands-api/src/services/Database/CRUD');

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
            throw logError(err);
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
