const mongoose = require('mongoose');

const schema = {
    address1: { type: mongoose.Schema.Types.String, default: '--empty--' },
    address2: { type: mongoose.Schema.Types.String, default: '--empty--' },
    number: { type: mongoose.Schema.Types.String, default: '--empty--' },
    postalCode: { type: mongoose.Schema.Types.String, default: '--empty--' },
    city: { type: mongoose.Schema.Types.String, default: '--empty--' },
    state: { type: mongoose.Schema.Types.String, default: '--empty--' },
    country: { type: mongoose.Schema.Types.String, default: '--empty--' }
};

module.exports = schema;
