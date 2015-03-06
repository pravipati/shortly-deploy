var db = require('mongoose');
var path = require('path');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');

dbURI = process.env.dbURI || 'mongodb://localhost:27017';

db.connect(dbURI);

var getShortCode = function(url){
  var shasum = crypto.createHash('sha1');
  shasum.update(url);
  return shasum.digest('hex').slice(0, 5);
};

var Urls = db.Schema({
  url: String,
  base_url: String,
  code: {type: String, set: getShortCode},
  title: String,
  visits: {type: Number, default: 0}
});



var Users = db.Schema({
  username: String,
  saltHash: String,
});

Users.virtual('password').set(function(password) {
  this.saltHash = bcrypt.hashSync(password);
});

Users.methods.comparePassword = function(password, cb){
  bcrypt.compare(password, this.saltHash, function(err, isMatch) {
    if (err){
      console.error(err);
    }
    cb(isMatch);
  });
};



module.exports.db = db;
module.exports.users = Users;
module.exports.urls = Urls;
