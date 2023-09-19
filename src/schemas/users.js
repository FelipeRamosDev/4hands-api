const Collection = require('@Collection');
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
            fieldName: 'slackName',
            type: String
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
            fieldName: 'gitHub',
            type: Object
        },
        {
            fieldName: 'jira',
            type: Object
        },
        {
            fieldName: 'repos',
            type: [ObjectId],
            default: [],
            ref: 'repos',
            refConfig: {
                relatedField: 'owner',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'spaceDesks',
            type: [ObjectId],
            default: [],
            ref: 'space_desks',
            refConfig: {
                relatedField: 'owner',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'tickets',
            type: [ObjectId],
            default: [],
            ref: 'tickets',
            refConfig: {
                relatedField: 'assignedUsers',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'tasks',
            type: [ObjectId],
            default: [],
            ref: 'tasks',
            refConfig: {
                relatedField: 'assignedUsers',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'myPullRequests',
            type: [ObjectId],
            default: [],
            ref: 'pull_requests',
            refConfig: {
                relatedField: 'owner',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'myReviews',
            type: [ObjectId],
            default: [],
            ref: 'code_reviews',
            refConfig: {
                relatedField: 'reviewers',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'pullRequestsAssigned',
            type: [ObjectId],
            default: [],
            ref: 'pull_requests',
            refConfig: {
                relatedField: 'assignedUsers',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'myComments',
            type: [ObjectId],
            default: [],
            ref: 'comments',
            refConfig: {
                relatedField: 'author',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'myOrganizations',
            type: [ObjectId],
            default: [],
            ref: 'organizations',
            refConfig: {
                relatedField: 'owner',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'stashes',
            type: [ObjectId],
            ref: 'stashes',
            refConfig: {
                relatedField: 'author',
                type: 'ObjectId'
            }
        }
    ]
});
