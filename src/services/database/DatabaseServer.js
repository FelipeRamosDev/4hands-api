const mongoose = require('mongoose');
const Counters = require('@schemas/counters');
const Logs = require('@schemas/logs');

class DatabaseServer {
    constructor (setup) {
        const { dbName, HOST, collections } = Object(setup);

        this.HOST = HOST || 'mongodb://0.0.0.0:27017/';
        this.dbName = dbName;
        this.DBServer;
        this.collections = [];

        this.collections.push(Counters.init(this));
        this.collections.push(Logs.init(this));

        if (Array.isArray(collections)) {
            collections.map(collection => this.collections.push(collection.init(this)));
        }
    }

    init({ success, error }) {
        mongoose.set('strictQuery', false);
        mongoose.connect(this.HOST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: this.dbName
        }).then(async (connectedDB) => {
            console.log(`>> Database ${this.dbName}: "${this.HOST}"`);

            this.DBServer = connectedDB;
            success(connectedDB);
        }).catch(err=>{
            console.error('Ocorreu um erro ao conectar no banco de dados: ', JSON.stringify(err, null, 2));
            error(err);
        });
    }
}

module.exports = DatabaseServer;
