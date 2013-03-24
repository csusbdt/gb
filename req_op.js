var url           = require('url');
var logger        = require('./logger');
var app_ajax      = require('./app_ajax');
var model_user    = require('./model_user');
var model_group   = require('./model_group');
var model_badge   = require('./model_badge');
var fb            = require('./fb');

exports.loginReplies   = 0;
exports.saveGroup = 0;
exports.readAdminGroup = 0;
exports.saveUser = 0;
exports.unknownOps     = 0;

/*
   All incoming ajax requests are submitted by POST
   and contain data encoded in json.
*/
exports.handle = function(req, res) {
  // Extract data from json string.
  app_ajax.parse(req, function(data) {
    console.log(JSON.stringify(data));
    if (data instanceof Error) {
      logger.warning(__filename + ' : handle : ' + data.message);
      return app_ajax.error(res); 
    }
    // Check for valid Facebook access token.
    if (data.accessToken === undefined) {
      logger.warning(__filename + ' : handle : facebook access token missing from ajax request');
      return app_ajax.error(res);
    }
    
    fb.getUid(data.accessToken, function(uid) {
      if (uid === undefined) { // user needs to login
        ++exports.loginReplies;
        return app_ajax.login(res);
      }
      if (uid instanceof Error) {
        logger.error(__filename + ' : handle : ' + uid.message);
        return app_ajax.error(res);
      }
      data.uid = uid;
      var pathname = url.parse(req.url).pathname;
      if (pathname === '/op/save-group') {
        ++exports.saveGroup;
        save_group(data, res);
      }else if (pathname === '/op/read-admin-groups') {
        ++exports.readAdminGroup;
        read_admin_groups(data, res);
      }else if (pathname === '/op/read-group-badges') {
        //++exports.readAdminGroup;
        read_group_badges(data, res);
      }else if (pathname === '/op/read-badge-members') {
        //++exports.readAdminGroup;
        read_badge_members(data, res);
      }else if (pathname === '/op/read-group-members') {
        //++exports.readAdminGroup;
        read_group_members(data, res);  
      }else if (pathname === '/op/save-badge') {
        //++exports.readAdminGroup;
        save_badge(data, res);        
      }else if (pathname === '/op/save-user') { 
        ++exports.saveUser;
        save_user(data, res);
      }else {
        ++exports.unknownOps;
      }
    });
  });
}

function save_group(data, res) {
  console.log('req_op save_group input = ' + JSON.stringify(data));
  var group = { name: data.name, desc: data.desc, uid: data.uid };
  model_group.createGroup(group, function(err) {
    if (err) {
      logger.error(__filename + ' : save_group : ' + err.message);
      return app_ajax.error(res);
    }
    console.log('group created with id = ' + group._id);
    return app_ajax.data(res, {gid : group._id} );
  });
};

function save_badge(data, res) {
  console.log('req_op save_badge input = ' + JSON.stringify(data));
  var badge = { name: data.name, desc: data.desc, pict:data.pict, gid: data.gid };
  model_badge.createBadge(badge, function(err) {
    if (err) {
      logger.error(__filename + ' : save_badge : ' + err.message);
      return app_ajax.error(res);
    }
    console.log('badge created with id = ' + badge._id);
    return app_ajax.data(res, {bid : badge._id} );
  });
};

function save_user(data, res) {
  console.log(JSON.stringify(data));
  var group = { name: data.name, desc: data.desc, uid: data.uid };
  model_group.createGroup(group, function(err) {
    if (err) {
      logger.error(__filename + ' : save_group : ' + err.message);
      return app_ajax.error(res);
    }
    console.log('group created');
    return app_ajax.data(res);
  });
};

function read_admin_groups(data, res) {
  console.log('req_op read_admin_groups input = ' + JSON.stringify(data));
  var user = { uid: data.uid };
  model_group.readAdminGroups(user, function(data) {
    if (data instanceof Error) {
      logger.error(__filename + ' : read_admin_groups : ' + data.message);
      return app_ajax.error(res);
    }
    console.log('admin_groups is read = ' + JSON.stringify(user.groups));
    return app_ajax.data(res, user.groups);
  });
};

function read_badge_members(data, res) {
  console.log('req_op read_badge_members input = ' + JSON.stringify(data));
  var badge = { bid: data.bid };
  model_badge.readBadgeMembers(badge, function(data) {
    if (data instanceof Error) {
      logger.error(__filename + ' : read_badge_members : ' + data.message);
      return app_ajax.error(res);
    }
    console.log('badge_members is read = ' + JSON.stringify(badge.members));
    return app_ajax.data(res, badge.members);
  });
};

function read_group_members(data, res) {
  console.log('req_op read_group_members input = ' + JSON.stringify(data));
  var group = { gid: data.gid };
  model_group.readGroupMembers(group, function(data) {
    if (data instanceof Error) {
      logger.error(__filename + ' : read_group_members : ' + data.message);
      return app_ajax.error(res);
    }
    console.log('group_members is read = ' + JSON.stringify(group.members));
    return app_ajax.data(res, group.members);
  });
};

function read_group_badges(data, res) {
  console.log('req_op read_group_badges input = ' + JSON.stringify(data));
  var group = { gid: data.gid };
  model_group.readGroupBadges(group, function(data) {
    if (data instanceof Error) {
      logger.error(__filename + ' : read_group_badges : ' + data.message);
      return app_ajax.error(res);
    }
    console.log('group_badges is read = ' + JSON.stringify(group.badges));
    return app_ajax.data(res, group.badges);
  });
};
