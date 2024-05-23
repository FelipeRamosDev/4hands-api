// Declaring globals
require('../../global');

const express = require('express');
const { execSync } = require('child_process');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https');
const path = require('path');
const FS = require('../FS');

/**
 * @class ServerAPI
 * @module ServerAPI
 * @namespace Services
 * @description Represents the main server class for the API.
 */
class ServerAPI {
    /**
     * @constructor
     * @description Creates an instance of ServerAPI.
     * @param {Object} setup - Configuration options for the server.
     * @param {string} setup.projectName - The name of the project.
     * @param {Object} setup.databaseConfig - Configuration options for the Database.
     * @param {string} setup.API_SECRET - The API secret key for session encryption.
     * @param {number} setup.sessionCookiesMaxAge - Maximum age of session cookies in milliseconds. Default is 86400000.
     * @param {string} setup.staticPath - The path to static files.
     * @param {string} setup.redisURL - The Redis database URL. Default is "redis://localhost:6379".
     * @param {Function} setup.listenCallback - Callback function to be executed when the server starts listening.
     * @param {boolean} setup.compileFE - Flag indicating whether to compile frontend code. Default is false.
     * @param {string} setup.jsonLimit - Limit of JSON requests. Default is '10mb'.
     * @param {boolean} setup.sessionResave - Flag indicating whether to save session data back to the session store. Default is true.
     * @param {boolean} setup.sessionSaveUninitialized - Flag indicating whether to save uninitialized sessions to the session store. Default is true.
     * @param {string} setup.keySSLPath - The path to the SSL key file.
     * @param {string} setup.certSSLPath - The path to the SSL certificate file.
     * @param {string} setup.FE_ORIGIN - The front-end host URL.
     * @param {number} setup.PORT - The port number on which the server will listen. Default is 80.
     * @param {Object} setup.emailConfig - Configurations for the MailService.
     * @param {string[]} setup.corsOrigin - Array with the allowed domains for CORS configuration. Default is ['http://localhost', 'https://localhost'].
     * @param {boolean} setup.noServer - If true, it doesn't start the server. Default is false.
     * @param {boolean} setup.useSockets - If true, it will start a sockets server. Default is false.
     */
    constructor (setup) {
        const {
            projectName,
            databaseConfig,
            API_SECRET,
            staticPath,
            listenCallback,
            compileFE,
            sessionResave,
            sessionSaveUninitialized,
            keySSLPath,
            certSSLPath,
            FE_ORIGIN,
            emailConfig,
            noServer,
            SOCKET_PORT,
            useSockets,
            
            // Defaults
            PORT = 80,
            jsonLimit = '10mb',
            defaultMaxListeners = 20,
            sessionCookiesMaxAge = 86400000,
            redisURL = 'redis://localhost:6379',
            corsOrigin = ['http://localhost', 'https://localhost']
        } = Object(setup);

        this.projectName = projectName;
        this.app_queue = [];
        this.API_SECRET = API_SECRET;
        this.sessionCookiesMaxAge = sessionCookiesMaxAge;
        this.staticPath = staticPath;
        this.redisURL = redisURL;
        this.corsOrigin = corsOrigin;
        this.compileFE = compileFE;
        this.jsonLimit = jsonLimit;
        this.sessionResave = (sessionResave !== undefined) ? sessionResave : true;
        this.sessionSaveUninitialized = (sessionSaveUninitialized !== undefined) ? sessionSaveUninitialized : true;
        this.listenCallback = listenCallback;
        this.FE_ORIGIN = FE_ORIGIN;
        this.PORT = PORT || 80;
        this.SOCKET_PORT = SOCKET_PORT;
        this.noServer = noServer;
        this.defaultMaxListeners = defaultMaxListeners;
        this.useSockets = useSockets;
        
        console.log(`[${this.projectName || '4hands-api'}] Starting Server API...`)
        if (this.defaultMaxListeners) {
            require('events').EventEmitter.defaultMaxListeners = this.defaultMaxListeners;
        }

        if (keySSLPath) {
            this.keySSLPath = path.normalize(this.projectPath + keySSLPath);
        }

        if (certSSLPath) {
            this.certSSLPath = path.normalize(this.projectPath + certSSLPath);
        }

        if (emailConfig) {
            const MailService = require('../Mail');
            this.mailService = new MailService(emailConfig);
        }

        this.isSuccess = (customCallback) => {
            try {
                this.runAppQueue();
                this.isListen = true;
                this.serverState = 'online';
                typeof listenCallback === 'function' && listenCallback.call(this);
                typeof customCallback === 'function' && customCallback.call(this);
            } catch (err) {
                throw err;
            }
        }

        this.useSSL = false;
        if (this.keySSLPath && this.certSSLPath) {
            this.useSSL = true;

            if (this.PORT === 80) {
                this.PORT = 443;
            }
        }

        // Initializing the Socket server
        if (this.useSockets) {
            const ServerIO = require('4hands-api/src/services/ServerIO');

            this.socketIO = new ServerIO({
                port: this.SOCKET_PORT,
                corsOrigin: this.corsOrigin,
                ssl: {
                    keyPath: this.keySSLPath,
                    certPath: this.certSSLPath
                }
            });
        }

        if (!this.noServer) {
            // 4hands-api native endpoints
            this.createEndpoint(require('4hands-api/src/controllers/api/health-check'));
            this.createEndpoint(require('4hands-api/src/controllers/api/read-logs'));
            this.createEndpoint(require('4hands-api/src/controllers/auth/login'));
            this.createEndpoint(require('4hands-api/src/controllers/auth/register'));
            this.createEndpoint(require('4hands-api/src/controllers/auth/signout'));
            this.createEndpoint(require('4hands-api/src/controllers/auth/confirm-email'));
            this.createEndpoint(require('4hands-api/src/controllers/auth/send-email-confirm'));
            this.createEndpoint(require('4hands-api/src/controllers/auth/reset-password/send-email'));
            this.createEndpoint(require('4hands-api/src/controllers/auth/reset-password/create-new'));
            this.createEndpoint(require('4hands-api/src/controllers/collection/create'));
            this.createEndpoint(require('4hands-api/src/controllers/collection/delete'));
            this.createEndpoint(require('4hands-api/src/controllers/collection/get/doc'));
            this.createEndpoint(require('4hands-api/src/controllers/collection/get/query'));
            this.createEndpoint(require('4hands-api/src/controllers/collection/update/document'));
        }

        if (databaseConfig) {
            const Database = require('../database/DatabaseServer');
            this.database = new Database({ ...databaseConfig }).init({
                success: this.init.bind(this),
                error: (err) => {
                    throw err;
                }
            });
        } else {
            this.init().catch(err => {
                throw err;
            });
        }
    }

    get projectPath() {
        return path.normalize(__dirname.replace(path.normalize('/node_modules/4hands-api/src/services/ServerAPI'), '/'));
    }

    /**
     * Initializes the server, setting up routes, middleware, and listeners.
     */
    async init() {
        this.rootPath = path.normalize(__dirname.replace(path.normalize('/node_modules/4hands-api/src/services'), '/'));
        this.app = express();
        this.serverState = 'loading';

        if (this.compileFE) {
            // Compiling frontend code
            const compile = execSync('npm run build');
            // Printiting webpack compile result
            console.log(compile.toString());
        }

        const RedisService = require('4hands-api/src/services/Redis');
        this.redisServ = new RedisService({
            url: this.redisURL,
            onError: (err) => {
                throw logError(err);
            }
        }, this);

        await this.redisServ.connect();
        
        // Configuring server
        if (!this.noServer) {
            // Initializing the Redis DB
            const RedisStore = require('connect-redis').default;
            this.app.use(cors({
                origin: this.corsOrigin,
                credentials: true
            }));

            this.app.use(bodyParser.json({ limit: this.jsonLimit }));
            this.app.use(express.json());

            if (this.API_SECRET) {
                this.app.use(session({
                    store: new RedisStore({ client: this.redisServ.client }),
                    secret: this.API_SECRET,
                    resave: this.sessionResave,
                    saveUninitialized: this.sessionSaveUninitialized,
                    cookie: {
                        secure: this.useSSL, // Set secure to true if using HTTPS
                        maxAge: this.sessionCookiesMaxAge
                    }
                }));
            } else {
                throw 'You need to provide a API SECRET to start the server!';
            }

            if (this.staticPath) {
                this.app.use(express.static(this.rootPath + this.staticPath));
            }

            if (this.useSSL) {
                this.listenSSL(this.PORT, () => this.isSuccess());
            } else {
                this.app.listen(this.PORT, () => this.isSuccess());
            }
        } else {
            this.isSuccess();
        }
    }

    /**
     * Starts the server to listen on the specified port.
     * @param {number} PORT - The port number on which the server will listen.
     * @param {Function} callback - Callback function to be executed when the server starts listening.
     */
    listen(PORT, callback) {
        if (!this.isListen && PORT) {
            this.app.listen(PORT, () => {
                this.isSuccess(callback);
            });
        }
    }

    /**
     * Starts the server with SSL encryption to listen on the specified port.
     * @param {number} PORT - The port number on which the server will listen.
     * @param {string} keySSLPath - The path to the SSL key file.
     * @param {string} certSSLPath - The path to the SSL certificate file.
     * @param {Function} callback - Callback function to be executed when the server starts listening.
     */
    listenSSL(PORT, callback) {
        try {
            if (this.PORT || PORT) {
                const SSL_KEY = FS.readFileSync(this.keySSLPath);
                const SSL_CERT = FS.readFileSync(this.certSSLPath);
    
                if (!SSL_KEY || !SSL_CERT) {
                    throw logError({
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
        } catch (error) {
            debugger;
        }
    }

    /**
     * Runs the queued application functions.
     */
    runAppQueue() {
        this.app_queue.map(item => item());
        this.app_queue = [];
    }

    /**
     * Creates an endpoint for the server.
     * @param {Object} endpoint - The Endpoint to be created.
     * @throws {Error.Log} If the endpoint parameter is not an instance of the Endpoint class.
     */
    createEndpoint(endpoint) {
        const Endpoint = require('../../models/settings/Endpoint');
        if (!endpoint instanceof Endpoint) {
            throw logError({
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

    getCollectionSet(collectionName) {
        if (Array.isArray(this.database?.collections)) {
            return this.database.collections.find(coll => coll.name === collectionName);
        }
    }
}

module.exports = ServerAPI;
