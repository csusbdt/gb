var http        = require('http');
var url         = require('url');
var app_http    = require('./app_http');
var req_root    = require('./req_root');
var req_mem     = require('./req_mem');
var req_file    = require('./req_file');
var req_ver     = require('./req_ver');
 
var verPath = '/' + process.env.APP_VER + '/';

function route(req, res) {
  var pathname = url.parse(req.url).pathname;
  if      (pathname === '/')                                  req_ver   .handle(req, res);
  else if (pathname === verPath)                              req_root  .handle(req, res);
  else if (pathname === '/mem')                               req_mem   .handle(req, res);
  else if (pathname === '/favicon.ico')                       req_file  .handle(req, res);
  else if (pathname.substr(0, verPath.length) === verPath)    req_file  .handle(req, res);
  else                                                        app_http  .redirect(res, verPath);
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