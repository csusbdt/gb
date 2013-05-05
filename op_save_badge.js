var model_badge       = require('./model_badge');
var model_group_badge = require('./model_group_badge');
var app_ajax          = require('./app_ajax');
var logger            = require('./logger');

exports.handle = function (uid, data, res) {
  //console.log('op_save_badge input = ' + JSON.stringify(data));
  var badge = { name: data.name, desc: data.desc, pict:data.pict, gid: data.gid };
  model_badge.create(badge, function(err) {
    if (err) {
      logger.error(__filename + ' : save_badge model_badge : ' + err.message);
      return app_ajax.error(res);
    }
    console.log('group created with id = ' + badge._id);
    
    var group_badge = { bid : badge._id, gid : badge.gid };
    model_group_badge.create(group_badge, function(err) {
    if (err) {
      logger.error(__filename + ' : save_badge model_group_badge : ' + err.message);
      return app_ajax.error(res);
    }
    console.log('group_badge created with id = ' + group_badge._id);
    
    });
  });
  
  return app_ajax.data(res, {gid : badge._id} );  
};

