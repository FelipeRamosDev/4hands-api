const mongoose = require('mongoose');
const models = require('../../../models');
const services = require('../../../services');
const CRUD = services.database.crud;
const UpdateDocument = models.routes.collection.UpdateDocument;
const Request = require('../../../models/RequestAPI');
const Response = UpdateDocument.response;

const bodySchema = {
    updateType: {
        type: String,
        default: 'one',
        enum: ['one', 'many']
    },
    collectionName: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        required: true
    },
    filter: {
        required: true,
        type: mongoose.SchemaTypes.Mixed
    },
    options: {
        default: {},
        type: {
            returnDocs: { type: Boolean },
            mongooseOpt: { type: Object }
        }
    }
};

module.exports = async function (req, res) {
    const request = new Request(req, bodySchema);
    const body = request.getBody();

    try {
        body.data.sessionUser = req.session.currentUser;
        const updated = await CRUD.update(body);        
        const response = new Response(updated, body.collection);

        return res.status(200).json(response);
    } catch(err) {
        const error = new Error.Log(err).append('database.updating_document', body.filter);
        return res.status(500).json(error.response());
    }
}
