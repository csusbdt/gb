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

exports.getGroupIdsByMemberId = function(member, cb) {
  model.db.collection('group_admin_links',{'gid' : true}).find(member).toArray(function(err, group_admin_links){
    model.db.close();
    if (err) return cb(err);
    console.log('model_group_admin getGroupIdsByMemberId group_admin_links = '+ JSON.stringify(group_admin_links));
    var group_ids = group_admin_links.map(function(group_admin_link) {return group_admin_link.gid;});
    cb(group_ids);
  });    
};

exports.getMemberIdsByGroupId = function(group, cb) {
  model.db.collection('group_admin_links',{'uid' : true}).find(group).toArray(function(err, group_admin_links){
    model.db.close();
    if (err) return cb(err);
    console.log('model_group_admin getMemberIdsByGroupId  group_admin_links = '+ JSON.stringify(group_admin_links));
    var member_ids = group_admin_links.map(function(group_admin_link) {return group_admin_link.uid;});
    cb(member_ids);
  });    
};
