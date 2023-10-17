const CollectionField = require('@models/settings/CollectionField');
const Collection = require('@models/settings/Collection');
const { ObjectId } = Collection.Types;

class CollectionEncrypt extends CollectionField {
    constructor(setup) {
        super(setup);

        try {
            this.type = ObjectId;
            this.ref = 'safe_values';
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = CollectionEncrypt;
