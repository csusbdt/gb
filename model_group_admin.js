var assert = require('assert');
var model = require('./model');

exports.create = function(group_admin, cb) {
  model.db.collection('group_admin_links').insert(
    group_admin,
    function(err) {
      model.db.close();
      if (err) return cb(err); 
      cb();
    }
  );
};
      
exports.getGroupIdsByAdminId = function(admin, cb) {
  model.db.collection('group_admin_links',{'gid' : true}).find(admin).toArray(function(err, group_admin_links){
    model.db.close();
    if (err) return cb(err);
    console.log('model_group_admin getGroupIdsByAdminId group_admin_links = '+ JSON.stringify(group_admin_links));
    var group_ids = group_admin_links.map(function(group_admin_link) {return group_admin_link.gid;});
    cb(group_ids);
  });    
};

exports.getAdminIdsByGroupId = function(group, cb) {
  model.db.collection('group_admin_links',{'uid' : true}).find(group).toArray(function(err, group_admin_links){
    model.db.close();
    if (err) return cb(err);
    console.log('model_group_admin getAdminIdsByGroupId group_admin_links = '+ JSON.stringify(group_admin_links));
    var admin_ids = group_admin_links.map(function(group_admin_link) {return group_admin_link.uid;});
    cb(admin_ids);
  });    
};

      
      
      