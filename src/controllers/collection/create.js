const Endpoint = require('4hands-api/src/models/settings/Endpoint');

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
        options: { type: Object }
    },
    controller: async (req, res) => {
        const CRUD = global._4handsAPI?.CRUD;
        const body = req.body;

        try {
            const doc = await CRUD.create(body.collectionName, body.data, body.options);
            if (doc.error) {
                return res.status(401).send(toError(doc));
            }

            return res.status(200).send({ success: true, doc: doc.toObject() });
        } catch(err) {
            return res.status(500).send(toError(err));
        }
    }
});
