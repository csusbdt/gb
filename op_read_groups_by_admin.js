var model_group       = require('./model_group');
var model_group_admin = require('./model_group_admin');
var app_ajax          = require('./app_ajax');
var logger            = require('./logger');

exports.handle = function (uid, data, res) {
  console.log('op_read_groups_by_admin  input = ' + JSON.stringify(data));
  var admin = { uid: uid };
  model_group_admin.getGroupIdsByAdminId(admin, function(gids) {
    if (gids instanceof Error) {
      logger.error(__filename + ' : model_group_admin.getGroupIdsByAdminId : ' + gids.message);
      return app_ajax.error(res);
    }
    console.log('admin_groups is read = ' + JSON.stringify(gids));
    
    model_group.getByIds(gids, function(groups){
      if (groups instanceof Error) {
        logger.error(__filename + ' : model_group.getByIds : ' + groups.message);
        return app_ajax.error(res);
      }
      console.log('groups is read = ' + JSON.stringify(groups));
      return app_ajax.data(res, groups);
    });
  });
};

