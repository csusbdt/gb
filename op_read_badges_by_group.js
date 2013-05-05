var model_badge       = require('./model_badge');
var model_group_badge = require('./model_group_badge');
var app_ajax          = require('./app_ajax');
var logger            = require('./logger');

exports.handle = function (uid, data, res) {
  console.log('op_read_badges_by_group  input = ' + JSON.stringify(data));
  var group = { gid: data.gid };
  model_group_badge.getBadgeIdsByGroupId(group, function(bids) {
    if (bids instanceof Error) {
      logger.error(__filename + ' : model_group_badge.getBadgeIdsByGroupId : ' + bids.message);
      return app_ajax.error(res);
    }
    console.log('group_badges is read = ' + JSON.stringify(bids));
    
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

