const Collection = require('@Collection');
const Config = require('@config');
const collectionName = Config.database.counterCollection;

module.exports = new Collection({
    name: collectionName,
    symbol: 'CN',
    displayName: 'Counters',
    pluralLabel: 'Counters',
    singularLabel: 'Counter',
    excludeGlobals: ['cod', 'index'],
    fieldsSet: [
        {
            fieldName: '_id',
            type: String,
            immutable: true,
            required: true
        },
        {
            fieldName: 'symbol',
            type: String,
            required: true
        },
        {
            fieldName: 'value',
            type: Number,
            default: 0
        }
    ]
});
