var url      = require('url');
var fs       = require('fs');
var zlib     = require('zlib');
var app_http = require('./app_http');

var html, ghtml, etag;

exports.init = function(cb) {
  fs.readFile('app.html', 'utf8', function(err, file) {
    if (err) throw err;
    html = new Buffer(file.replace(/FB_APP_ID/g, process.env.FB_APP_ID), 'utf8');
    etag = app_http.etag(html);
    zlib.gzip(html, function(err, result) {
      if (err) throw err;
      ghtml = result;
      cb();
    });
  });
};

exports.handle = function(req, res) {
  if (req.headers['if-none-match'] === etag) {
    return app_http.replyNotModified(res);
  }
  if (req.headers['accept-encoding'] !== undefined && 
      req.headers['accept-encoding'].indexOf('gzip') !== -1) {
    return app_http.replyCached(res, ghtml, 'text/html', etag, 'gzip');
  } 
  app_http.replyCached(res, html, 'text/html', etag); 
};
