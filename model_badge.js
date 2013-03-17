var assert = require('assert');
var model = require('./model');

exports.createBadge = function(badge, cb) {
  model.mongoClient.open(function(err, mongoClient) {
    if (err) return cb(err);
    var db = mongoClient.db(model.dbName);
    db.collection('badges').insert(
      badge,
      function(err) {
        //mongoClient.close();
        if (err) return cb(err); 
        var doc = { bid: badge._id, gid : badge.gid };
        db.collection('group_badge_links').insert(
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

exports.assignBadge = function(badge_user, cb) {
  model.mongoClient.open(function(err, mongoClient) {
    if (err) return cb(err);
    var db = mongoClient.db(model.dbName);
    db.collection('badge_user_links').insert(
      badge_user,
      function(err) {
        mongoClient.close();
        if (err) return cb(err); 
      }
    );  
  });
};


