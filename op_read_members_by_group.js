var model_group_member= require('./model_group_member');
var app_ajax          = require('./app_ajax');
var logger            = require('./logger');

exports.handle = function (uid, data, res) {
  console.log('op_read_members_by_group  input = ' + JSON.stringify(data));
  var group = { gid: data.gid };
  model_group_member.getMemberIdsByGroupId(group, function(uids) {
    if (uids instanceof Error) {
      logger.error(__filename + ' : model_group_member.getMemberIdsByGroupId : ' + uids.message);
      return app_ajax.error(res);
    }
    console.log('group_member is read = ' + JSON.stringify(uids));
    var members = uids.map(function(uid) {return {uid: uid};});
    console.log('members = ' + JSON.stringify(members));
    return app_ajax.data(res, members);
  });
};

