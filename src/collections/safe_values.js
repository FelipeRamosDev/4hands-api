/**
 * Represents a Collection model for storing encrypted data.
 * Defines the schema for 'safe_values' collection, specifying fields for encrypted data along with their types and constraints.
 *
 * @module SafeValuesCollection
 */
const Collection = require('4hands-api/src/models/settings/Collection');

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
