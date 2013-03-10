var app_http = require('./app_http');
var req_op   = require('./req_op');

exports.handle = function(req, res) {
  var page = '<p>Number of times login messages were returned for ajax requests: ' + req_op.loginReplies + '</p>' + 
             '<p>Number of get_num requests: ' + req_op.getNumRequests + '</p>' +
             '<p>Number of set_num requests: ' + req_op.setNumRequests + '</p>' +
             '<p>Number of req_op unknown ops: ' + req_op.unknownOps + '</p>' +
             '<p></p>';
      page = new Buffer(page, 'utf8');
  app_http.replyNotCached(res, page);
}