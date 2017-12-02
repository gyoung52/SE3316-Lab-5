var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CollectionSchema = new Schema ({
    username: String,
    name: String,
    desc: String,
    ispublic: Boolean,
    images: Array(),
    rank: Array()
});

module.exports = mongoose.model('Collections', CollectionSchema);