const mongoose = require('mongoose');
const models = require('../../models');
const services = require('../../services');
const CRUD = services.database.crud;
const Delete = models.routes.collection.Delete;
const Request = require('../../models/RequestAPI');
const Response = Delete.response;

const bodySchema = {
    deleteType: { type: String, default: 'one', enum: ['one', 'many'] },
    collectionName: { type: String, required: true },
    filter: { type: mongoose.SchemaTypes.Mixed, required: true }, // '_id' || {mongoose-filter}
    options: { type: Object, default: {} } // mongoose options
};

module.exports = async function (req, res) {
    const request = new Request(req, bodySchema);
    const body = request.getBody();

    try {
        const deleted = await CRUD.del(body);

        if (deleted){
            return res.status(200).json(new Response(deleted));
        } else {
            const error = new Error.Log('apiResponse.collection.delete');
            return res.status(500).json(error.response());
        }
    } catch(err) {
        const error = new Error.Log(err).append('apiResponse.collection.delete');
        return res.status(500).json(error.response());
    }
}
