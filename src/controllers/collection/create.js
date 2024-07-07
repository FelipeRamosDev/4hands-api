const models = require('4hands-api/src/models');
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
        const CRUD = global._4handsAPI?.CRUD;

        try {
            const body = req.body;
    
            // Creating document
            const doc = await CRUD.create(body.collectionName, body.data, body.options);
    
            if (!doc.errors) {
                return res.status(200).json(new Response(doc));
            } else {
                const error = logError(doc);
                return res.status(500).send(error);
            }
        } catch(err) {
            const error = logError(err);
            return res.status(500).send(error);
        }
    }
});
