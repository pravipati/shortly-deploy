var db = require('mongoose');
var path = require('path');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');

dbURI = process.env.dbURI || 'mongodb://localhost:27017';

db.connect(dbURI);

var Urls = db.schema({
  id: ObjectID,
  url: String,
  base_url: String,
  code: {type: String, default: getShortCode.bind(this)},
  title: String,
  visits: {type: Number, default: 0}

});

var getShortCode = function(){
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  return shasum.digest('hex').slice(0, 5);
};


var Users = db.schema({
  id: ObjectID,
  username: String,
  saltHash: String,
});

Users.virtual('password').set(function(password) {
  this.saltHash = bcyrpt.hashSync(password);
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
