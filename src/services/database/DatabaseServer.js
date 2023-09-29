const mongoose = require('mongoose');
const counters = require('@schemas/counters');
const logs = require('@schemas/logs');
const auth_buckets = require('@schemas/auth_buckets');

class DatabaseServer {
    constructor (setup) {
        const { dbName, HOST, collections } = Object(setup);

        this.HOST = HOST || 'mongodb://0.0.0.0:27017/';
        this.dbName = dbName;
        this.DBServer;
        this.collections = [];

        this.collections.push(counters.init(this));
        this.collections.push(logs.init(this));
        this.collections.push(auth_buckets.init(this));

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

        return this;
    }
}

module.exports = DatabaseServer;
