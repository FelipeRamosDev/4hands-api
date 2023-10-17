const CollectionField = require('@models/settings/CollectionField');

class CollectionEncrypt extends CollectionField {
    constructor(setup) {
        super(setup);

        try {
            const Collection = require('@models/settings/Collection');
            const { ObjectId } = Collection.Types;

            this.type = ObjectId;
            this.ref = 'safe_values';
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = CollectionEncrypt;
