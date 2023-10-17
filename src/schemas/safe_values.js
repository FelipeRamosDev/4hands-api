const Collection = require('@models/settings/Collection');

module.exports = new Collection({
    name: 'safe_values',
    displayName: 'Safe Values',
    pluralLabel: 'Safe Values',
    singularLabel: 'Safe Value',
    symbol: 'SFV',
    fieldsSet: [
        {
            fieldName: 'encrypted',
            type: Buffer
        },
        {
            fieldName: 'type',
            type: String,
            required: true,
            enum: ['hash', 'encrypt']
        },
        {
            fieldName: 'algorithm',
            type: String,
            default: 'aes-256-ctr'
        },
        {
            fieldName: 'iv',
            type: Buffer
        },
        {
            fieldName: 'salt',
            type: Buffer
        },
        {
            fieldName: 'derivatedKey',
            type: Buffer
        }
    ]
});
