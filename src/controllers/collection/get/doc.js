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
        const CRUD = global._4handsAPI?.CRUD;

        try {
            const body = req.body;
            const {populate, select} = body.options || {};
            const queryDoc = CRUD.getDoc(body);

            if (populate) {
                queryDoc.populateAll(populate);
            }

            queryDoc.select(select);

            const doc = await queryDoc.exec();
            return res.status(200).send({ success: true, doc });
        } catch(err) {
            const error = logError(err);
            res.status(500).send(error);
        }
    }
});
