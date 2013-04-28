var model_badge       = require('./model_badge');
var model_user_badge  = require('./model_user_badge');
var app_ajax          = require('./app_ajax');
var logger            = require('./logger');

exports.handle = function (data, res) {
  console.log('op_read_badge_members input = ' + JSON.stringify(data));
  var group = { gid: data.gid };
  var badge = { bid: data.bid };
  model_group_member.getMemberIdsByGroupId(group, function(uids) {
    if (uids instanceof Error) {
      logger.error(__filename + ' : model_group_member.getMemberIdsByGroupId : ' + uids.message);
      return app_ajax.error(res);
    }
    console.log('group_member is read = ' + JSON.stringify(uids));
    return app_ajax.data(res, uids);
  });
};

