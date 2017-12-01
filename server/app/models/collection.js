var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CollectionSchema = new Schema ({
    user: String,
    shared: Boolean,
    name: String,
    desc: String,
    ispublic: Boolean,
    images: Array(),
    rating: Number
});

module.exports = mongoose.model('Collections', CollectionSchema);