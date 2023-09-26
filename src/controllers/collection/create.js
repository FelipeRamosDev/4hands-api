const models = require('@models');
const CRUD = require('@CRUD');
const routeModels = models.routes.collection.Create;
const Endpoint = require('@src/models/settings/Endpoint');
const Response = routeModels.response;

module.exports = new Endpoint({
    method: 'PUT',
    routePath: '/collection/create',
    bodySchema: {
        collectionName: { type: String, required: true },
        data: { type: Object, required: true },
        options: { type: Object, default: {} } // Mongoose .save(options)
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
