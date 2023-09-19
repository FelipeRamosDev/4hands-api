require('module-alias/register');
// Declaring globals
require('../../global');

const express = require('express');
// const { execSync } = require('child_process');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

// Routes
const routes = require('@routes/index');

module.exports = class ServerAPI {
    constructor (setup) {
        const { API_SECRET, sessionMaxAge, staticPath, PORT, listenCallback } = Object(setup);
        const rootPath = __dirname.replace('\\node_modules\\4hands-api\\src\\services', '\\').replace(/\\/g, '/');

        this.app = express();
        this.serverState = 'loading';

        // // Compiling frontend code
        // const compile = execSync('npm run build');
        // // Printiting webpack compile result
        // console.log(compile.toString());

        // Configuring server
        this.app.use(cors());
        this.app.use(bodyParser.json({ limit: '10mb' }));
        this.app.use(express.json());

        if (staticPath) {
            this.app.use(express.static(rootPath + staticPath));
        }

        if (API_SECRET && sessionMaxAge) {
            this.app.use(session({
                secret: API_SECRET,
                resave: true,
                saveUninitialized: true,
                cookie: { maxAge: sessionMaxAge }
            }));
        }

        // Standard routes
        this.app.use('/api', routes.api);
        this.app.use('/auth', routes.auth);
        this.app.use('/collection', routes.collection);

        if (PORT) {
            this.app.listen(PORT, listenCallback);
            this.serverState = 'online';
        }
    }

    listen(port, cb) {
        this.app.listen(port, cb);
    }
}
