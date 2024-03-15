const models = require('4hands-api/src/models');
const CRUD = require('4hands-api/src/services/database/crud');
const routeModels = models.routes.collection.Create;
const Endpoint = require('4hands-api/src/models/settings/Endpoint');
const Response = routeModels.response;

/**
 * Represents a controller endpoint for creating a document in a collection.
 * @name CollectionCreate
 * @type {Endpoint}
 */
module.exports = new Endpoint({
    method: 'PUT',
    routePath: '/collection/create',
    isAuthRoute: true,
    bodySchema: {
        collectionName: { type: String, required: true },
        data: { type: Object, required: true },
        options: { type: Object, default: {} }
    },
    controller: async (req, res) => {
        try {
            const body = req.body;
    
            // Creating document
            const doc = await CRUD.create(body.collectionName, body.data, body.options);
    
            if (!doc.errors) {
                return res.status(200).json(new Response(doc));
            } else {
                const error = new Error.Log(doc).append('apiResponse.collection.create_doc_errors', body.collectionName);
                return res.status(500).json(error.response());
            }
        } catch(err) {
            const error = new Error.Log(err).append('apiResponse.collection.create', req.body.collectionName);
            return res.status(500).json(error.response());
        }
    }
});
