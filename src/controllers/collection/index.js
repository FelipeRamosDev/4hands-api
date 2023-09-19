const create = require('./create');
const deleteRoute = require('./delete');
const get = require('./get');
const update = require('./update');

module.exports = {
    create,
    delete: deleteRoute,
    get,
    update
};
