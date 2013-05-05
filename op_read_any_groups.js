var model_group       = require('./model_group');
var model_group_member= require('./model_group_member');
var app_ajax          = require('./app_ajax');
var logger            = require('./logger');

exports.handle = function (uid, data, res) {
  console.log('op_read_any_groups  input = ' + JSON.stringify(data));
  model_group.getAll(function(groups){
    if (groups instanceof Error) {
      logger.error(__filename + ' : model_group.getAll : ' + groups.message);
      return app_ajax.error(res);
    }
    console.log('groups is read = ' + JSON.stringify(groups));
    return app_ajax.data(res, groups);
  });
  
  
    
};

