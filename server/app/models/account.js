var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = new Schema ({
    email: String,
    password: String,
    loggedIn: Boolean
});

module.exports = mongoose.model('Account', AccountSchema);