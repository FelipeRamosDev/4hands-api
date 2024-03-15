const collections = require('./src/schemas');
const DatabaseServer = require('./src/services/database/DatabaseServer');
const ServerAPI = require('./src/services/ServerAPI');
const SocketServer = require('./src/services/SocketServer');
const SocketClient = require('./src/services/SocketClient');
const Collection = require('./src/models/settings/Collection');
const Endpoint = require('./src/models/settings/Endpoint');
const CRUD = require('./src/services/database/crud');
const helpers = require('./src/helpers');
const interface = require('./src/interface');
const middlewares = require('./src/middlewares');
const models = require('./src/models');
const resources = require('./src/resources');
const schemas = require('./src/schemas');
const services = require('./src/services');
const validation = require('./src/validation');

/**
 * @class
 * @name DatabaseServer
 */
exports.Database = DatabaseServer;

/**
 * @class
 * @name ServerAPI
 */
exports.ServerAPI = ServerAPI;

/**
 * @class
 * @name SocketServer
 */
exports.SocketServer = SocketServer;

/**
 * @class
 * @name SocketClient
 */
exports.SocketClient = SocketClient;

/**
 * @class
 * @name Endpoint
 */
exports.Endpoint = Endpoint;

/**
 * @class
 * @name Collection
 */
exports.Collection = Collection;

/**
 * @module CRUD
 */
exports.CRUD = CRUD;

exports.collections = collections;
exports.helpers = helpers;
exports.interface = interface;
exports.middlewares = middlewares;
exports.models = models;
exports.resources = resources;
exports.schemas = schemas;
exports.services = services;
exports.validation = validation;
