const mongoose = require('mongoose');
const Endpoint = require('4hands-api/src/models/settings/Endpoint');

/**
 * Represents a controller endpoint for updating a document in a collection.
 * @name CollectionUpdateDocument
 * @type {Endpoint}
 */
module.exports = new Endpoint({
    method: 'POST',
    routePath: '/collection/update',
    isAuthRoute: true,
    bodySchema: {
        type: {
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
        const CRUD = global._4handsAPI?.CRUD;
        const body = req.body;

        try {
            const updated = await CRUD.update(body);        
            return res.status(200).send({ success: true, updated });
        } catch(err) {
            const error = logError(err);
            return res.status(500).send(error);
        }
    }
});
