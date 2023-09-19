const { ServerAPI } = require('../index');

// Initializing MongoDB
require('@services/database/init').then(async () => {
    const api = new ServerAPI({
        PORT: 80,
        listenCallback: () => {
            console.log('4Hands API connected!');
        }
    });
}).catch(err => {
    throw err;
});
