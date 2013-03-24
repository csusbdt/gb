var http         = require('http');
var url          = require('url');
var app_http     = require('./app_http');
var req_root     = require('./req_root');
var req_mem      = require('./req_mem');
var req_app      = require('./req_app');
var req_issuer   = require('./req_issuer');
var req_file     = require('./req_file');
var req_op       = require('./req_op');
var req_counters = require('./req_counters');

var verpath  = '/' + process.env.APP_VER + '/';
var issuerpath = verpath + 'issuer';

var req_verdir   = req_file.create('public_ver', verpath.length);
var req_rootdir  = req_file.create('public_root', 1);

exports.init = function(cb) {
  var n = 4;
  function done() {
    if (--n === 0) cb();
  }
  req_verdir  .init(done);
  req_rootdir .init(done);
  req_app     .init(done);
  req_issuer  .init(done);
};

function route(req, res) {
  var pathname = url.parse(req.url).pathname;
  if      (pathname                           === '/')             req_root    .handle(req, res)
  else if (pathname                           === verpath)         req_app     .handle(req, res)
  else if (pathname                           === issuerpath)      req_issuer  .handle(req, res)
  else if (pathname.substr(0, verpath.length) === verpath)         req_verdir  .handle(req, res)
  else if (pathname.substr(0, 4)              === '/op/')          req_op      .handle(req, res)
  else if (pathname                           === '/mem')          req_mem     .handle(req, res)
  else if (pathname                           === '/counters')     req_counters.handle(req, res)
  else                                                             req_rootdir .handle(req, res);
}

function requestHandler(req, res) {
  // Make sure messages are sent over https when deployed through Heroku.
  // See https://devcenter.heroku.com/articles/http-routing
  if (req.headers['x-forwarded-proto'] === 'https' ||    // common case
      req.headers['x-forwarded-proto'] === undefined) {  // local deployment
    route(req, res);
  } else {
    res.writeHead(302, { 'Location': "https://" + req.headers.host + req.url });
    res.end();
  }
}

exports.start = function() {
  http.createServer(requestHandler).listen(process.env.PORT, function(err) {
    if (err) console.log(err);
    else console.log("listening on " + process.env.PORT);
  });
};