require('module-alias/register');

const express = require('express');
// const { execSync } = require('child_process');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

// Routes
const routes = require('@routes/index');

class ServerAPI {
    constructor (setup) {
        const { API_SECRET, sessionMaxAge, staticPath, PORT, listenCallback } = Object(setup);

        this.app = express();

        // // Compiling frontend code
        // const compile = execSync('npm run build');
        // // Printiting webpack compile result
        // console.log(compile.toString());

        // Configuring server
        this.app.use(cors());
        this.app.use(bodyParser.json({ limit: '10mb' }));
        this.app.use(express.json());

        if (staticPath) {
            this.app.use(express.static('../../../../' + staticPath));
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

        if (PORT) {
            this.app.listen(PORT, listenCallback);
        }
    }

    listen(port, cb) {
        this.app.listen(port, cb);
    }
}

module.exports = ServerAPI;
