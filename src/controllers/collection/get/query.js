const mongoose = require('mongoose');
const models = require('4hands-api/src/models');
const CRUD = require('4hands-api/src/services/database/crud');
const GetQueryCollection = models.routes.collection.GetQueryCollection;
const Endpoint = require('4hands-api/src/models/settings/Endpoint');
const Response = GetQueryCollection.response;

/**
 * Represents a controller endpoint for listing documents in a collection.
 * @name CollectionGetQuery
 * @type {Endpoint}
 */
module.exports = new Endpoint({
    method: 'GET',
    routePath: '/collection/get/query',
    isAuthRoute: true,
    bodySchema: {
        collectionName: {
            type: String,
            required: true
        },
        filter: {
            type: mongoose.SchemaTypes.Mixed
        },
        options: {
            type: {
                paginate: { type: Object, default: {} },
                populate: { type: Object, default: {} },
                readable: { type: Boolean },
                select: { type: [String], default: [] }
            }
        }
    },
    controller: async function (req, res) {
        try {
            const body = req.body;
            const {paginate, populate, readable, select} = Object(body.options);
            const query = CRUD.query(body);
            let result;
    
            if (paginate) {
                query.paginate(paginate);
            }
            if (populate) {
                query.populateAll();
            }
            if (select) {
                query.select(select);
            }
    
            if (readable){
                result = await query.readable();
            } else {
                result = await query.exec();
            }
    
            return res.status(200).json(new Response(result, body));
        } catch(err) {
            const error = logError(err);
            res.status(500).send(error);
        }
    }
});
