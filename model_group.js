var assert = require('assert');
var model = require('./model');

exports.create = function(group, cb) {
  model.db.collection('groups').insert(
    group,
    function(err) {
      model.db.close();
      if (err) return cb(err); 
      cb();
    }
  );  
};

exports.getByIds = function(group_ids, cb){
  model.db.collection('groups').find({'_id' : {$in: group_ids} }).toArray(function(err, groups){
    model.db.close();
    if (err) return cb(err);
    console.log('model_group getByIds groups array = '+ JSON.stringify(groups));  
    cb(groups);
  });
};


exports.readAdminGroups = function(user, cb) {
  model.db.collection('group_admin_links',{'gid' : true}).find(user).toArray(function(err, group_admin_links){
    if (err) {model.db.close(); return cb(err);}
    console.log('model_group readAdminGroups group_admin_links = '+ JSON.stringify(group_admin_links));
    
    var group_ids = group_admin_links.map(function(group_admin_link) {return group_admin_link.gid;});
    model.db.collection('groups').find({'_id' : {$in: group_ids} }).toArray(function(err, groups){
      model.db.close();
      if (err) return cb(err);
      console.log('model_group readAdminGroups groups array = '+ JSON.stringify(groups));  
      user.groups = groups;
      cb();
    });
    
  });    
};

exports.readGroupMembers = function(group, cb) {
  model.db.collection('group_member_links',{'uid' : true}).find(group).toArray(function(err, group_member_links){
    if (err) {model.db.close(); return cb(err);}
    console.log('model_group readGroupMembers group_member_links = '+ JSON.stringify(group_member_links));
    
    var member_ids = group_member_links.map(function(group_member_link) {return group_member_link.gid;});
    model.db.collection('users').find({'_id' : {$in: member_ids} }).toArray(function(err, members){
      model.db.close();
      if (err) return cb(err);
      console.log('model_group readGroupMembers members array = '+ JSON.stringify(members));  
      group.members = members;
      cb();
    });
    
  });    
};

exports.readGroupBadges = function(group, cb){
  model.db.collection('group_badge_links',{'bid' : true}).find(group).toArray(function(err, group_badge_links){
    if (err) {model.db.close(); return cb(err);}
    console.log('model_group readGroupBadges group_badge_links = '+ JSON.stringify(group_badge_links));
    
    var badge_ids = group_badge_links.map(function(group_badge_link) {return group_badge_link.bid;});
    model.db.collection('badges').find({'_id' : {$in: badge_ids} }).toArray(function(err, badges){
      model.db.close();
      if (err) return cb(err);
      console.log('model_group readGroupBadges badges array = '+ JSON.stringify(badges));  
      group.badges = badges;
      cb();
    });
    
  });   
};

