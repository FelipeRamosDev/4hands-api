const { ServerAPI } = require('../index');
const { API_SECRET } = require('./envConfigs.json');

// Endpoints
const TestingCheckEndpoint = require('./controllers/testing/check');

// Initializing MongoDB
require('@services/database/init').then(async () => {
    const api = new ServerAPI({
        API_SECRET,
        listenCallback: () => {
            console.log('4Hands API connected!');
        }
    });

    api.createEndpoint(TestingCheckEndpoint);
}).catch(err => {
    throw err;
});
