var assert = require('assert');
var model = require('./model');

exports.createGroup = function(group, cb) {
  model.mongoClient.open(function(err, mongoClient) {
    if (err) return cb(err);
    var db = mongoClient.db(model.dbName);
    db.collection('groups').insert(
      group,
      function(err) {
        if (err) return cb(err); 
        var doc = { gid : group._id, uid : group.uid };
        db.collection('group_admin_links').insert(
          doc,
          function(err) {
            mongoClient.close();
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
        mongoClient.close();
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
        mongoClient.close();
        if (err) return cb(err);
        cb();        
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
        mongoClient.close();
        if (err) return cb(err);
      }
    );  
  });
};

exports.readAdminGroups = function(user, cb) {
  model.mongoClient.open(function(err, mongoClient) {
    if (err) {mongoClient.close(); return cb(err);}
    var db = mongoClient.db(model.dbName);
    db.collection('group_admin_links', {'gid' : true}).find(user).toArray(function(err, group_admin_links){
      if (err) {mongoClient.close(); return cb(err);}
      console.log('model_group readAdminGroups group_admin_links = '+ JSON.stringify(group_admin_links));
      
      var group_ids = group_admin_links.map(function(group_admin_link) {return group_admin_link.gid;});
      db.collection('groups').find({'_id' : {$in: group_ids} }).toArray(function(err, groups){
        mongoClient.close();
        if (err) return cb(err);
        console.log('model_group readAdminGroups groups array = '+ JSON.stringify(groups));  
        user.groups = groups;
        cb();
      });

    });    
  });
};

