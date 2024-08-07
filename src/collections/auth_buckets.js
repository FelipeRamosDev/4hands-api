const Collection = require('4hands-api/src/services/CollectionBucket/Collection');
const { ObjectId } = Collection.Types;

module.exports = new Collection({
    name: 'auth_buckets',
    symbol: 'AUTH',
    fieldsSet: [
        {
            fieldName: 'password',
            type: Buffer
        },
        {
            fieldName: 'user',
            type: ObjectId,
            required: true,
            ref: 'users',
            refConfig: {
                relatedField: 'auth',
                type: 'ObjectId'
            }
        }
    ]
});
