var url           = require('url');
var logger        = require('./logger');
var app_ajax      = require('./app_ajax');
var model_user    = require('./model_user');
var model_group   = require('./model_group');
var fb            = require('./fb');

/*---
exports.loginReplies   = 0;
exports.getNumRequests = 0;
exports.setNumRequests = 0;
exports.unknownOps     = 0;
--*/
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
        //++exports.loginReplies;
        return app_ajax.login(res);
      }
      if (uid instanceof Error) {
        logger.error(__filename + ' : handle : ' + uid.message);
        return app_ajax.error(res);
      }
      data.uid = uid;
      var pathname = url.parse(req.url).pathname;
      if (pathname === '/op/save-group') {
        //++exports.setNumRequests;
        save_group(data, res);
      } if (pathname === '/op/read-groups') { 
        read_groups(data, res);
      }if (pathname === '/op/save-user') { 
        save_user(data, res);
      }else {
        //++exports.unknownOps;
      }
    });
  });
}

function save_group(data, res) {
  console.log(JSON.stringify(data));
  var group = { name: data.name, desc: data.desc, uid: data.uid };
  model_group.createGroup(group, function(err) {
    if (err) {
      console.log(__filename + ' : save_group : ' + err.message);
      return app_ajax.error(res);
    }
    console.log('group created');
    return app_ajax.reply(res);
  });
};

function save_user(data, res) {
  console.log(JSON.stringify(data));
  var group = { name: data.name, desc: data.desc, uid: data.uid };
  model_group.createGroup(group, function(err) {
    if (err) {
      console.log(__filename + ' : save_group : ' + err.message);
      return app_ajax.error(res);
    }
    console.log('group created');
    return app_ajax.reply(res);
  });
};

function read_groups(data, res) {
  console.log(JSON.stringify(data));
  var uid = { uid: data.uid };
  model_group.readGroups(uid, function(err) {
    if (err) {
      console.log(__filename + ' : save_group : ' + err.message);
      return app_ajax.error(res);
    }
    console.log('group is read');
    return app_ajax.reply(res);
  });
};