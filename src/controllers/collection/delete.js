const mongoose = require('mongoose');
const Endpoint = require('4hands-api/src/models/settings/Endpoint');

/**
 * Represents a controller endpoint for deleting a document in a collection.
 * @name CollectionDelete
 * @type {Endpoint}
 */
module.exports = new Endpoint({
    method: 'DELETE',
    routePath: '/collection/delete',
    isAuthRoute: true,
    bodySchema: {
        deleteType: { type: String, default: 'one', enum: ['one', 'many'] },
        collectionName: { type: String, required: true },
        filter: { type: mongoose.SchemaTypes.Mixed, required: true }, // '_id' || {mongoose-filter}
        options: { type: Object, default: {} } // mongoose options
    },
    controller: async (req, res) => {
        const CRUD = global._4handsAPI?.CRUD;
        const body = req.body;
    
        try {
            const deleted = await CRUD.del(body);
    
            if (deleted){
                return res.status(200).json({ success: true, deletedFilter: body.filter });
            } else {
                const error = logError('apiResponse.collection.delete');
                return res.status(500).send(error);
            }
        } catch(err) {
            const error = logError(err);
            return res.status(500).send(error);
        }
    }
});
