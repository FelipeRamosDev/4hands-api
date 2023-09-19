const mongoose = require('mongoose');
const models = require('@models');
const GetDoc = models.routes.collection.GetDoc;
const Request = require('@models/RequestAPI');
const Response = GetDoc.response;
const CRUD = require('@services/database/crud');

const bodySchema = {
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
                type: mongoose.SchemaTypes.Mixed
            }
        }
    }
};

module.exports = async (req, res) => {
    try {
        const request = new Request(req, bodySchema);
        const body = request.getBody();
        const {populate, select} = body.options || {};
        const queryDoc = CRUD.getDoc(body);

        if (populate) {
            queryDoc.populateAll(populate);
        }
        queryDoc.select(select);

        const execute = await queryDoc.exec();
        const response = new Response(execute, body);

        return res.status(200).json(response);
    } catch(err) {
        const error = new Error.Log(err).append('apiResponse.collection.get.doc')
        res.status(500).json(error.response());
    }
}
