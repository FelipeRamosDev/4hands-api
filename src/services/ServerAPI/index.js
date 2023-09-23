require('module-alias/register');
// Declaring globals
require('../../global');

const express = require('express');
// const { execSync } = require('child_process');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https');

// Routes
const routes = require('@routes/index');
const Endpoint = require('@src/models/settings/Endpoint');

class ServerAPI {
    constructor (setup) {
        const {
            API_SECRET,
            sessionCookiesMaxAge,
            staticPath,
            listenCallback,
            compileFE,
            jsonLimit,
            sessionResave,
            sessionSaveUninitialized,
            keySSLPath,
            certSSLPath
        } = Object(setup);

        let { PORT } = Object(setup);
        let useSSL = false;
        
        if (!PORT) {
            PORT = 80;
        }
        
        this.rootPath = __dirname.replace('\\node_modules\\4hands-api\\src\\services', '\\').replace(/\\/g, '/');
        this.app = express();
        this.serverState = 'loading';

        if (compileFE) {
            // Compiling frontend code
            const compile = execSync('npm run build');
            // Printiting webpack compile result
            console.log(compile.toString());
        }

        // Configuring server
        this.app.use(cors());
        this.app.use(bodyParser.json({ limit: jsonLimit || '10mb' }));
        this.app.use(express.json());

        if (staticPath) {
            this.app.use(express.static(this.rootPath + staticPath));
        }

        if (API_SECRET) {
            this.app.use(session({
                secret: API_SECRET,
                resave: (sessionResave !== undefined) ? sessionResave : true,
                saveUninitialized: (sessionSaveUninitialized !== undefined) ? sessionSaveUninitialized : true,
                cookie: { maxAge: sessionCookiesMaxAge || 86400000 }
            }));
        } else {
            throw 'You need to provide a API SECRET to start the server!';
        }

        // Standard routes
        this.app.use('/api', routes.api);
        this.app.use('/auth', routes.auth);
        this.app.use('/collection', routes.collection);

        if (keySSLPath && certSSLPath) {
            useSSL = true;
        }

        if (useSSL) {
            const SSL_KEY = fs.readFileSync(this.rootPath + keySSLPath);
            const SSL_CERT = fs.readFileSync(this.rootPath + certSSLPath);

            if (SSL_KEY && SSL_CERT) {
                const options = {
                    key: SSL_KEY,
                    cert: SSL_CERT
                };

                https.createServer(options, app).listen(PORT, () => {
                    console.log(`Server listening on port ${PORT}`);
                    this.PORT = PORT;
                });
            } else {
                throw new Error.Log({
                    name: 'SSLCertificateNotFound',
                    message: `The SSL certificate wasn't found on the directory!`
                });
            }
        } else {
            this.app.listen(PORT, () => {
                this.PORT = PORT;
                typeof listenCallback === 'function' && listenCallback();
            });
        }
    }

    listen(PORT, callback) {
        if (!this.PORT && PORT) {
            this.app.listen(PORT, () => {
                this.PORT = PORT;
                typeof callback === 'function' && callback();
            });
        }
    }

    listenSSL(PORT, keySSLPath, certSSLPath, callback) {
        if (!this.PORT && PORT) {
            const SSL_KEY = fs.readFileSync(this.rootPath + keySSLPath);
            const SSL_CERT = fs.readFileSync(this.rootPath + certSSLPath);

            if (!SSL_KEY || !SSL_CERT) {
                throw new Error.Log({
                    name: 'SSLCertificateNotFound',
                    message: `The SSL certificate wasn't found on the directory!`
                });
            }

            const options = {
                key: SSL_KEY,
                cert: SSL_CERT
            };

            https.createServer(options, this.app).listen(PORT, () => {
                this.PORT = PORT;
                typeof callback === 'function' && callback();
            });
        }
    }

    createEndpoint(endpoint) {
        if (!endpoint instanceof Endpoint) {
            throw new Error.Log({
                name: 'INVALID_ENDPOINT',
                message: 'The "endpoint" param is not an Endpoint type!'
            });
        }

        switch (endpoint.method) {
            case 'GET': {
                this.app.get(endpoint.routePath, ...endpoint.middlewares, endpoint.controller);
                break;
            }
            case 'POST': {
                this.app.post(endpoint.routePath, ...endpoint.middlewares, endpoint.controller);
                break;
            }
            case 'PUT': {
                this.app.put(endpoint.routePath, ...endpoint.middlewares, endpoint.controller);
                break;
            }
            case 'DELETE': {
                this.app.delete(endpoint.routePath, ...endpoint.middlewares, endpoint.controller);
                break;
            }
        }
    }
}

module.exports = ServerAPI;
