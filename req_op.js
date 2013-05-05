var url           = require('url');
var logger        = require('./logger');
var app_ajax      = require('./app_ajax');
var fb            = require('./fb');
var model_group   = require('./model_group');
var model_badge   = require('./model_badge');
var model_user    = require('./model_user');


var op_save_group           = require('./op_save_group');
var op_save_badge           = require('./op_save_badge');
var op_read_groups_by_admin = require('./op_read_groups_by_admin');
var op_read_badges_by_group = require('./op_read_badges_by_group');
var op_read_members_by_group= require('./op_read_members_by_group');
var op_read_any_groups      = require('./op_read_any_groups');
var op_join_group           = require('./op_join_group');
var op_read_my_badges       = require('./op_read_my_badges');
var op_read_badge_members   = require('./op_read_badge_members');
var op_assign_badge         = require('./op_assign_badge');

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
  app_ajax.parse(req, function(body) {
    console.log(JSON.stringify(body));
    if (body instanceof Error) {
      logger.warning(__filename + ' : handle : ' + body.message);
      return app_ajax.error(res); 
    }
    // Check for valid Facebook access token.
    if (body.accessToken === undefined) {
      logger.warning(__filename + ' : handle : facebook access token missing from ajax request');
      return app_ajax.error(res);
    }
    // Check appVer
    //if (body.appVer !== process.env.APP_VER){
    //  logger.warning(__filename + ' : handle : appVer is invalid');
    //  return app_ajax.error(res);
    //}    
    
    fb.getUid(body.accessToken, function(uid) {
      if (uid === undefined) { // user needs to login
        ++exports.loginReplies;
        return app_ajax.login(res);
      }
      if (uid instanceof Error) {
        logger.error(__filename + ' : handle : ' + uid.message);
        return app_ajax.error(res);
      }
      body.uid = uid;
      var pathname = url.parse(req.url).pathname;
      if (pathname === '/op/save-group') {
        ++exports.saveGroup;
        op_save_group.handle(body.uid, body.data, res);
      }else if (pathname === '/op/read-groups-by-admin') {
        ++exports.readAdminGroup;
        op_read_groups_by_admin.handle(body.uid, body.data, res);
      }else if (pathname === '/op/read-any-groups') {
        //++exports.readAdminGroup;
        op_read_any_groups.handle(body.uid, body.data, res);
      }else if (pathname === '/op/join-group') {
        //++exports.readAdminGroup;
        op_join_group.handle(body.uid, body.data, res); 
      }else if (pathname === '/op/read-badges-by-group') {
        //++exports.readAdminGroup;
        //console.log("here");
        op_read_badges_by_group.handle(body.uid, body.data, res);
      }else if (pathname === '/op/read-members-by-group') {
        //++exports.readAdminGroup;
        //console.log("here");
        op_read_members_by_group.handle(body.uid, body.data, res);
      }else if (pathname === '/op/read-badge-members') {
        //++exports.readAdminGroup;
        op_read_badge_members.handle(body.uid, body.data, res);
      //}else if (pathname === '/op/read-group-members') {
        //++exports.readAdminGroup;
        //read_group_members(body.uid, body.data, res);  
      }else if (pathname === '/op/save-badge') {
        //++exports.readAdminGroup;
        op_save_badge.handle(body.uid, body.data, res);        
      }else if (pathname === '/op/assign-badge') {
        //++exports.readAdminGroup;
        op_assign_badge.handle(body.uid, body.data, res);        
      }else if (pathname === '/op/read-my-badges') {
        //++exports.readAdminGroup;
        op_read_my_badges.handle(body.uid, body.data, res);        
      }else if (pathname === '/op/save-user') { 
        ++exports.saveUser;
        save_user(data, res);
      }else {
        ++exports.unknownOps;
      }
    });
  });
}


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
