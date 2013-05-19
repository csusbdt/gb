var model_badge       = require('./model_badge');
var model_user_badge  = require('./model_user_badge');
var app_ajax          = require('./app_ajax');
var logger            = require('./logger');

exports.handle = function (uid, data, res) {
  console.log('op_read_my_badges input = ' + JSON.stringify(data));
  var user = { uid: uid }; 
  model_user_badge.getBadgeIdsByUserId(user, function(bids) {
    if (bids instanceof Error) {
      logger.error(__filename + ' : model_user_badge.getBadgeIdsByUserId : ' + bids.message);
      return app_ajax.error(res);
    }
    console.log('user_badges is read = ' + JSON.stringify(bids)); 
    model_badge.getByIds(bids, function(badges){
      if (badges instanceof Error) {
        logger.error(__filename + ' : model_badge.getByIds : ' + badges.message);
        return app_ajax.error(res);
      }
      console.log('badges is read = ' + JSON.stringify(badges));
      return app_ajax.data(res, badges);
    });
  });
};

