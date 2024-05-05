const mongoose = require('mongoose');
const models = require('4hands-api/src/models');
const GetDoc = models.routes.collection.GetDoc;
const Response = GetDoc.response;
const CRUD = require('4hands-api/src/services/database/crud');
const Endpoint = require('4hands-api/src/models/settings/Endpoint');

/**
 * Represents a controller endpoint for getting a document in a collection.
 * @name CollectionGetDoc
 * @type {Endpoint}
 */
module.exports = new Endpoint({
    method: 'GET',
    routePath: '/collection/get/doc',
    isAuthRoute: true,
    bodySchema: {
        collectionName: {
            type: String,
            required: true
        },
        filter: {
            type: mongoose.SchemaTypes.Mixed,
            required: true
        },
        options: {
            default: {},
            type: {
                paginate: {
                    views: { type: Number },
                    page: { type: Number },
                    seeMore: { type: Boolean }
                },
                select: {
                    default: [],
                    type: Array
                },
                populate: {
                    type: Object
                }
            }
        }
    },
    controller: async (req, res) => {
        try {
            const body = req.body;
            const {populate, select} = body.options || {};
            const queryDoc = CRUD.getDoc(body);
    
            if (populate) {
                queryDoc.populateAll(populate);
            }

            queryDoc.select(select);
    
            const execute = await queryDoc.exec();
            const response = new Response(execute, body);
    
            return res.status(200).json(response);
        } catch(err) {
            const error = logError(err);
            res.status(500).json(error.response());
        }
    }
});
