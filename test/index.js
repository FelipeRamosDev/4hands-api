const { ServerAPI, collections } = require('../index');
const { API_SECRET } = require('./envConfigs.json');

// Endpoints
const TestingCheckEndpoint = require('./controllers/testing/check');

// Collections
const Testing = require('./collections/Testing');
const Users = collections.users;
const AuthBuckets = collections.auth_buckets;

Users.addNewField({
    fieldName: 'myTestings',
    type: [],
    default: []
});

global.api = new ServerAPI({
    projectName: 'testing-app',
    API_SECRET,
    databaseConfig: {
        dbName: 'testing-app',
        collections: [
            Users,
            AuthBuckets,
            Testing,
        ]
    },
    listenCallback: () => {
        console.log('4Hands API connected!');
    }
});

api.createEndpoint(TestingCheckEndpoint);
