var assert = require('assert');
var model = require('./model');

exports.create = function(user, cb) {
  model.db.collection('users').insert(
    user,
    function(err) {
      model.db.close();
      if (err) return cb(err); 
      cb();
    }
  );  
};

// This is using save, because it will check 
// if the uid is exist then it will update the last_login timestamp 
// otherwise it will create new record.
exports.login = function(user, cb) {
  model.db.collection('users').save(
    user,
    function(err) {
      model.db.close();
      if (err) return cb(err); 
      cb();
    }
  ); 
};