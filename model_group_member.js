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
  model.db.collection('group_member_links',{'gid' : true}).find(member).toArray(function(err, group_member_links){
    model.db.close();
    if (err) return cb(err);
    console.log('model_group_member getGroupIdsByMemberId group_member_links = '+ JSON.stringify(group_member_links));
    var group_ids = group_member_links.map(function(group_member_link) {return group_member_link.gid;});
    cb(group_ids);
  });    
};

exports.getMemberIdsByGroupId = function(group, cb) {
  model.db.collection('group_member_links',{'uid' : true}).find(group).toArray(function(err, group_member_links){
    model.db.close();
    if (err) return cb(err);
    console.log('model_group_member getMemberIdsByGroupId  group_member_links = '+ JSON.stringify(group_member_links));
    var member_ids = group_member_links.map(function(group_member_link) {return group_member_link.uid;});
    cb(member_ids);
  });    
};
