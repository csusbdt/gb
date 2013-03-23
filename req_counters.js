var app_http = require('./app_http');
var req_op   = require('./req_op');
var logger   = require('./logger');

exports.handle = function(req, res) {
  var page = '<p>Number of times login messages were returned for ajax requests: ' + req_op.loginReplies + '</p>' +
             '<p>save-group requests: '    + req_op.saveGroup   + '</p>' +
             '<p>read-admin-group requests: '    + req_op.readAdminGroup   + '</p>' +
             '<p>save-user requests: '    + req_op.saveUser   + '</p>' +
             '<p>unknown op requests: ' + req_op.unknownOps       + '</p>' +  
             '<p>logger errors: '       + logger.errorsReceived   + '</p>' +
             '<p>logger warnings: '     + logger.warningsReceived + '</p>' +
             '<p>logger info: '         + logger.infoReceived     + '</p>' +
             '<p></p>';
      page = new Buffer(page, 'utf8');
  app_http.replyNotCached(res, page);
}
