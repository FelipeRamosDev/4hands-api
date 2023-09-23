require('module-alias/register');

const collections = require('@schemas');
const DatabaseServer = require('./src/services/database/DatabaseServer');
const ServerAPI = require('./src/services/ServerAPI');
const SocketServer = require('./src/services/SocketServer');

exports.Database = DatabaseServer;
exports.ServerAPI = ServerAPI;
exports.SocketServer = SocketServer;

exports.collections = collections;
