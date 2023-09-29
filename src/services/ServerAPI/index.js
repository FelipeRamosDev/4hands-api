require('module-alias/register');
// Declaring globals
require('../../global');

const express = require('express');
const { execSync } = require('child_process');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https');
const Database = require('@services/database/DatabaseServer');
const FS = require('@services/FS');
// Routes

const Endpoint = require('@src/models/settings/Endpoint');

class ServerAPI {
    constructor (setup) {
        const {
            projectName,
            databaseConfig,
            API_SECRET,
            sessionCookiesMaxAge,
            staticPath,
            listenCallback,
            compileFE,
            jsonLimit,
            sessionResave,
            sessionSaveUninitialized,
            keySSLPath,
            certSSLPath,
            PORT
        } = Object(setup);

        this.projectName = projectName;
        this.app_queue = [];
        this.API_SECRET = API_SECRET;
        this.sessionCookiesMaxAge = sessionCookiesMaxAge || 86400000;
        this.staticPath = staticPath;
        this.compileFE = compileFE;
        this.jsonLimit = jsonLimit || '10mb';
        this.sessionResave = (sessionResave !== undefined) ? sessionResave : true;
        this.sessionSaveUninitialized = (sessionSaveUninitialized !== undefined) ? sessionSaveUninitialized : true;
        this.keySSLPath = keySSLPath;
        this.certSSLPath = certSSLPath;
        this.listenCallback = listenCallback;
        this.PORT = PORT || 80;

        this.isSuccess = (customCallback) => {
            try {
                this.runAppQueue();
                this.isListen = true;
                this.serverState = 'online';
                typeof listenCallback === 'function' && listenCallback();
                typeof customCallback === 'function' && customCallback();
            } catch (err) {
                throw err;
            }
        }

        this.useSSL = false;
        if (this.keySSLPath && this.certSSLPath) {
            this.useSSL = true;
        }

        // Standard routes
        this.createEndpoint(require('@controllers/api/health-check'));
        this.createEndpoint(require('@controllers/auth/login'));
        this.createEndpoint(require('@controllers/auth/register'));
        this.createEndpoint(require('@controllers/collection/create'));
        this.createEndpoint(require('@controllers/collection/delete'));
        this.createEndpoint(require('@controllers/collection/get/doc'));
        this.createEndpoint(require('@controllers/collection/get/query'));
        this.createEndpoint(require('@controllers/collection/update/document'));

        if (databaseConfig) {
            this.database = new Database({ ...databaseConfig }).init({
                success: this.init.bind(this),
                error: (err) => {
                    throw err;
                }
            });
        } else {
            this.init();
        }
    }

    init() {
        this.rootPath = __dirname.replace('\\node_modules\\4hands-api\\src\\services', '\\').replace(/\\/g, '/');
        this.app = express();
        this.serverState = 'loading';

        if (this.compileFE) {
            // Compiling frontend code
            const compile = execSync('npm run build');
            // Printiting webpack compile result
            console.log(compile.toString());
        }

        // Configuring server
        this.app.use(cors());
        this.app.use(bodyParser.json({ limit: this.jsonLimit }));
        this.app.use(express.json());

        if (this.staticPath) {
            this.app.use(express.static(this.rootPath + this.staticPath));
        }

        if (this.API_SECRET) {
            this.app.use(session({
                secret: this.API_SECRET,
                resave: this.sessionResave,
                saveUninitialized: this.sessionSaveUninitialized,
                cookie: { maxAge: this.sessionCookiesMaxAge }
            }));
        } else {
            throw 'You need to provide a API SECRET to start the server!';
        }

        if (this.useSSL) {
            this.listenSSL(this.PORT, this.keySSLPath, this.certSSLPath, () => this.isSuccess());
        } else {
            this.app.listen(this.PORT, () => this.isSuccess());
        }
    }

    listen(PORT, callback) {
        if (!this.isListen && PORT) {
            this.app.listen(PORT, () => {
                this.isSuccess(callback);
            });
        }
    }

    listenSSL(PORT, keySSLPath, certSSLPath, callback) {
        if (this.PORT || PORT) {
            const SSL_KEY = FS.readFileSync(this.rootPath + keySSLPath);
            const SSL_CERT = FS.readFileSync(this.rootPath + certSSLPath);

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

    runAppQueue() {
        this.app_queue.map(item => item());
        this.app_queue = [];
    }

    createEndpoint(endpoint) {
        if (!endpoint instanceof Endpoint) {
            throw new Error.Log({
                name: 'INVALID_ENDPOINT',
                message: 'The "endpoint" param is not an Endpoint type!'
            });
        }

        const params = [endpoint.routePath, ...(endpoint.middlewares || []), endpoint.controller];

        switch (endpoint.method) {
            case 'GET': {
                if (!this.app) {
                    this.app_queue.push(() => this.app.get(...params))
                } else {
                    this.app.get(...params);
                }

                return;
            }
            case 'POST': {
                if (!this.app) {
                    this.app_queue.push(() => this.app.post(...params))
                } else {
                    this.app.post(...params);
                }

                return;
            }
            case 'PUT': {
                if (!this.app) {
                    this.app_queue.push(() => this.app.put(...params))
                } else {
                    this.app.put(...params);
                }

                return;
            }
            case 'DELETE': {
                if (!this.app) {
                    this.app_queue.push(() => this.app.delete(...params))
                } else {
                    this.app.delete(...params);
                }

                return;
            }
        }
    }
}

module.exports = ServerAPI;
