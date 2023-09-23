const mongoose = require('mongoose');
let dbName = '4Hands-api';

process.argv.map(item => {
    if (item.indexOf('--env') === 0) {
        const parsed = item.split('=');

        if (parsed[1] === 'production') {
            dbName = '4Hands-api';
        }
        
        if (parsed[1] === 'STG') {
            dbName = '4Hands-api-STG';
        }
    }
})

console.log('DB Name:', dbName);
module.exports = new Promise((resolve, reject) => {
    mongoose.set('strictQuery', false);
    mongoose.connect('mongodb://0.0.0.0:27017/', {useNewUrlParser: true, useUnifiedTopology: true, dbName }).then(async (connectedDB) => {
        console.log('>> Banco de dados conectado em: mongodb://localhost:27017/\n');

        // Globals
        global.initializedCollections = [];

        resolve(connectedDB);
    }).catch(err=>{
        console.error('Ocorreu um erro ao conectar no banco de dados: ', JSON.stringify(err, null, 2));
        reject(err);
    });
})
