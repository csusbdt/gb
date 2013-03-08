var assert = require('assert');
var model = require('./model');

exports.createGroup = function(group, cb) {
  model.mongoClient.open(function(err, mongoClient) {
    if (err) return cb(err);
    var db = mongoClient.db(model.dbName);
    db.collection('groups').insert(
      group,
      function(err) {
        //mongoClient.close();
        if (err) return cb(err); 
        var doc = { gid : group._id, uid : group.uid };
        db.collection('group_admin_links').insert(
          doc,
          function(err) {
            //mongoClient.close();
            if (err) return cb(err); 
            cb();
          }
        ); 
      }
    );  
  });
};

exports.addUser = function(group_user, cb) {
  model.mongoClient.open(function(err, mongoClient) {
    if (err) return cb(err);
    var db = mongoClient.db(model.dbName);
    db.collection('group_user_links').insert(
      group_user,
      function(err) {
        //mongoClient.close();
        if (err) return cb(err); 
      }
    );  
  });
};

exports.addAdmin = function(group_admin, cb) {
  model.mongoClient.open(function(err, mongoClient) {
    if (err) return cb(err);
    var db = mongoClient.db(model.dbName);
    db.collection('group_admin_links').insert(
      group_admin,
      function(err) {
        //mongoClient.close();
        if (err) return cb(err); 
      }
    );  
  });
};

exports.addBadge = function(group_badge, cb) {
  model.mongoClient.open(function(err, mongoClient) {
    if (err) return cb(err);
    var db = mongoClient.db(model.dbName);
    db.collection('group_badge_links').insert(
      group_admin,
      function(err) {
        //mongoClient.close();
        if (err) return cb(err); 
      }
    );  
  });
};
