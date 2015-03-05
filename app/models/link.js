var mongoose = require('../config');

var Link = mongoose.db.model('Urls', mongoose.urls);

module.exports = Link;
