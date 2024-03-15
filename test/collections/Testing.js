const Collection = require('4hands-api/src/models/settings/Collection');
const Testing = require('./models/Testing');

module.exports = new Collection({
    name: 'testings',
    displayName: 'Testing',
    pluralLabel: 'Testings',
    singularLabel: 'Testing',
    symbol: 'TEST',
    Model: Testing,
    fieldsSet: [
        {
            fieldName: 'testName',
            type: String,
            required: true
        },
        {
            fieldName: 'isTested',
            type: Boolean,
            default: false
        }
    ]
})
