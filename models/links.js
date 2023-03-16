const mongoose = require('mongoose');

const Schema = mongoose.Schema;
//links schema(model)
const linksSchema = new Schema({
    link: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('links', linksSchema);