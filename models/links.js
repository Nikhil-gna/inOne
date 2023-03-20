const mongoose = require('mongoose');

const linksSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
});

const Links = mongoose.model('links', linksSchema);

module.exports = Links;
