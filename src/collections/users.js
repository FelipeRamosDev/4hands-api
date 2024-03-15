const Collection = require('4hands-api/src/models/settings/Collection');
const { ObjectId } = Collection.Types;

module.exports = new Collection({
    name: 'users',
    symbol: 'U',
    displayName: 'Users',
    pluralLabel: 'Users',
    singularLabel: 'User',
    fieldsSet: [
        {
            fieldName: 'auth',
            type: ObjectId,
            ref: 'auth_buckets',
            refConfig: {
                relatedField: 'user',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'userName',
            type: String
        },
        {
            fieldName: 'firstName',
            type: String,
            required: true
        },
        {
            fieldName: 'lastName',
            type: String,
            required: true
        },
        {
            fieldName: 'email',
            type: String,
            required: true
        },
        {
            fieldName: 'phone',
            type: String
        },
        {
            fieldName: 'isEmailConfirmed',
            type: Boolean,
            default: false
        }
    ]
});
