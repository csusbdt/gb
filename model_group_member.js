var assert = require('assert');
var model = require('./model');

exports.create = function(group_member, cb) {
  model.db.collection('group_member_links').insert(
    group_member,
    function(err) {
      model.db.close();
      if (err) return cb(err); 
      cb();
    }
  );
};