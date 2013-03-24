var assert = require('assert');
var model = require('./model');

exports.createBadge = function(badge, cb) {
  model.db.collection('badges').insert(
    badge,
    function(err) {
      if (err) return cb(err); 
      var doc = { bid : badge._id, gid : badge.gid };
      model.db.collection('group_badge_links').insert(
        doc,
        function(err) {
          model.db.close();
          if (err) return cb(err); 
          cb();
        }
      ); 
    }
  );  
};

exports.readBadgeMembers = function(badge, cb) {
  model.db.collection('badge_member_links',{'uid' : true}).find(badge).toArray(function(err, badge_member_links){
    if (err) {model.db.close(); return cb(err);}
    console.log('model_group readBadgeMembers badge_member_links = '+ JSON.stringify(badge_member_links));
    
    var member_ids = badge_member_links.map(function(badge_member_link) {return badge_member_link.gid;});
    model.db.collection('users').find({'_id' : {$in: member_ids} }).toArray(function(err, members){
      model.db.close();
      if (err) return cb(err);
      console.log('model_group readBadgeMembers members array = '+ JSON.stringify(members));  
      badge.members = members;
      cb();
    });
    
  });    
};

/*
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
*/

