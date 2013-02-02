var app_http = require('./app_http');

var html = new Buffer('<script>location.replace("/' + process.env.APP_VER + '/");</script>', 'utf8');

exports.handle = function(req, res) {
  app_http.replyNotCached(res, html);
};