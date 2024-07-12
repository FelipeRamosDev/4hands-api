const mongoose = require('mongoose');
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
            type: Object
        }
    },
    controller: async (req, res) => {
        const CRUD = global._4handsAPI?.CRUD;
        const { collectionName, filter, options } = req.body;
        const { populateMethod } = Object(options);

        try {
            const docQuery = CRUD.getDoc({
                collectionName,
                filter
            });

            if (populateMethod && typeof docQuery[populateMethod] === 'function') {
                const loaded = await docQuery[populateMethod]();
                return res.status(201).send(loaded?.toObject ? loaded.toObject() : null);
            }
            
            else if (populateMethod) {
                return res.status(404).send(toError({
                    name: 'UNKNOWN_POPULATE_METHOD',
                    message: `The populate method provided "${populateMethod}" doesn't exist!`
                }))
            }
            
            else {
                const loaded = await docQuery.exec();
                return res.status(201).send(loaded?.toObject ? loaded.toObject() : null);
            }
        } catch(err) {
            const error = logError(err);
            res.status(500).send(error);
        }
    }
});
