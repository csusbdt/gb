var model_group_member= require('./model_group_member');
var app_ajax          = require('./app_ajax');
var logger            = require('./logger');

exports.handle = function (uid, data, res) {
  //console.log('op_save_group input = ' + JSON.stringify(data));
  var group_member = { gid: data.gid, uid: uid };
  model_group_member.create(group_member, function(err) {
    if (err) {
      logger.error(__filename + ' : join_group model_group_member : ' + err.message);
      return app_ajax.error(res);
    }
    console.log('group_member created with id = ' + group_member._id);
    return app_ajax.data(res);    
  });
};

