const mongoose = require('mongoose');
const models = require('@models');
const Endpoint = require('@src/models/settings/Endpoint');
const CRUD = require('@CRUD');
const UpdateDocument = models.routes.collection.UpdateDocument;
const Response = UpdateDocument.response;

module.exports = new Endpoint({
    method: 'POST',
    routePath: '/collection/update/document',
    bodySchema: {
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
    },
    controller: async (req, res) => {
        const body = req.body;
    
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
});
