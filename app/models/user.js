var mongoose = require('../config');

var User = mongoose.db.model('User', mongoose.users)

module.exports = User;
