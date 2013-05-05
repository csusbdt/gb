var model_group       = require('./model_group');
var model_group_admin = require('./model_group_admin');
var app_ajax      = require('./app_ajax');
var logger = require('./logger');

exports.handle = function (uid, data, res) {
  //console.log('op_save_group input = ' + JSON.stringify(data));
  var group = { name: data.name, desc: data.desc, uid: uid };
  model_group.create(group, function(err) {
    if (err) {
      logger.error(__filename + ' : save_group model_group : ' + err.message);
      return app_ajax.error(res);
    }
    console.log('group created with id = ' + group._id);
    
    var group_admin = { gid : group._id, uid : group.uid };
    model_group_admin.create(group_admin, function(err) {
      if (err) {
        logger.error(__filename + ' : save_group model_group_admin : ' + err.message);
        return app_ajax.error(res);
      }
      console.log('group_admin created with id = ' + group_admin._id);
      
    });

    return app_ajax.data(res, {gid : group._id} );
  });
  
    
};

