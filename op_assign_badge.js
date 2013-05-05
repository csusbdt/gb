var model_user_badge  = require('./model_user_badge');
var app_ajax          = require('./app_ajax');
var logger            = require('./logger');

exports.handle = function (uid, data, res) {
  //console.log('op_save_group input = ' + JSON.stringify(data));
  var user_badge = { uid: data.uid, bid: data.bid };
  model_user_badge.create(user_badge, function(err) {
    if (err) {
      logger.error(__filename + ' : assign_badge model_user_badge : ' + err.message);
      return app_ajax.error(res);
    }
    console.log('user_badge created with id = ' + user_badge._id);
    return app_ajax.data(res);    
  });
};

