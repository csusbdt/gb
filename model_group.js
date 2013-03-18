var assert = require('assert');
var model = require('./model');

exports.createGroup = function(group, cb) {
  model.db.collection('groups').insert(
    group,
    function(err) {
      if (err) return cb(err); 
      var doc = { gid : group._id, uid : group.uid };
      model.db.collection('group_admin_links').insert(
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


exports.readAdminGroups = function(user, cb) {
  model.db.collection('group_admin_links',{'gid' : true}).find(user).toArray(function(err, group_admin_links){
    if (err) {mongoClient.close(); return cb(err);}
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

