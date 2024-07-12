const { Mixed } = require('mongoose').SchemaTypes;
const Endpoint = require('4hands-api/src/models/settings/Endpoint');

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
        filter: { type: Mixed },
        options: { type: Object }
    },
    controller: async function (req, res) {
        const CRUD = global._4handsAPI?.CRUD;
        const { collectionName, filter, options } = req.body;
        const { page, sort, limit, populateMethod } = Object(options);

        try {
            const query = CRUD.query({
                collectionName,
                filter,
                sort,
                limit,
                page
            });
    
            if (populateMethod && query[populateMethod]) {
                const result = await query[populateMethod]();

                return res.status(200).send(result.map(doc => doc.toObject ? doc.toObject() : doc));
            } else {
                const result = await query.exec();

                return res.status(200).send(result.map(doc => doc.toObject ? doc.toObject() : doc));
            }
        } catch(err) {
            const error = logError(err);
            res.status(500).send(error);
        }
    }
});
