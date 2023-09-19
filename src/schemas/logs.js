const Collection = require('@Collection');

module.exports = new Collection({
    name: 'logs',
    symbol: 'LG',
    displayName: 'Logs',
    pluralLabel: 'Logs',
    singularLabel: 'Log',
    fieldsSet: [
        {
            fieldName: 'type',
            type: String,
            required: true,
            default: 'log',
            enum: ['log', 'warn', 'error']
        },
        {
            fieldName: 'read',
            type: Boolean,
            default: false
        },
        {
            fieldName: 'name',
            type: String,
            default: 'UnkownError'
        },
        {
            fieldName: 'code',
            type: String
        },
        {
            fieldName: 'groupedLogs',
            type: Number,
            default: 0
        },
        {
            fieldName: 'resource',
            type: String
        },
        {
            fieldName: 'message',
            type: String, 
            default: ''
        },
        {
            fieldName: 'stack',
            type: String,
            default: ''
        },
        {
            fieldName: 'errorList',
            type: String
        },
        {
            fieldName: 'validationErrors',
            type: String
        },
        {
            fieldName: 'additionalData',
            type: String,
            default: '{}'
        }
    ]
});
