const models = require('@models');
const services = require('@services');
const CRUD = services.database.crud;
const routeModels = models.routes.collection.Create;
const Request = require('@models/RequestAPI');
const Response = routeModels.response;

const bodySchema = {
    collectionName: { type: String, required: true },
    data: { type: Object, required: true },
    options: { type: Object, default: {} } // Mongoose .save(options)
};

module.exports = async function (req, res) {
    try {
        const request = new Request(req, bodySchema);
        const body = request.getBody();

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
