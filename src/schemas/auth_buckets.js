const Collection = require('@Collection');
const { ObjectId } = Collection.Types;

module.exports = new Collection({
    name: 'auth_buckets',
    symbol: 'AUTH',
    displayName: 'Auth Butckets',
    pluralLabel: 'Auth Butckets',
    singularLabel: 'Auth Butcket',
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
