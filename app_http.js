var url    = require('url');
var fs     = require('fs');
var crypto = require('crypto');

/*
  max-age is set to one year in seconds (31536000)
  expires is set to now plus one year in milliseconds (31536000000)
*/

exports.redirect = function(res, path) {
  res.writeHead(302, { 'Location': path });
  res.end();
};

exports.etag = function(buffer) {
  var shasum = crypto.createHash('sha1');
  shasum.update(buffer, 'binary');
  return shasum.digest('hex');
}

exports.replyNotCached = function(res, buffer) {
  res.writeHead(200, {
    'Content-Type'     : 'text/html',
    'Content-Length'   : buffer.length,
    'Connection'       : 'keep-alive',
    'Proxy-Connection' : 'keep-alive',
    'Pragma'           : 'no-cache',
    'Cache-Control'    : 'no-cache, no-store'
  });
  res.end(buffer);
};

exports.replyCached = function(res, buffer, contentType, etag, contentEncoding) {
  if(contentEncoding) {
    res.writeHead(200, {
      'Content-Type'     : contentType,
      'Content-Length'   : buffer.length,
      'Connection'       : 'keep-alive',
      'Proxy-Connection' : 'keep-alive',
      'Pragma'           : 'public',
      'Cache-Control'    : 'max-age=31536000',
      'Vary'             : 'Accept-Encoding',
      'Expires'          : new Date(Date.now() + 31536000000).toUTCString(),
      'ETag'             : etag,
      'Content-Encoding' : contentEncoding
    });
  } else {
    res.writeHead(200, {
      'Content-Type'     : contentType,
      'Content-Length'   : buffer.length,
      'Connection'       : 'keep-alive',
      'Proxy-Connection' : 'keep-alive',
      'Pragma'           : 'public',
      'Cache-Control'    : 'max-age=31536000',
      'Vary'             : 'Accept-Encoding',
      'Expires'          : new Date(Date.now() + 31536000000).toUTCString(),
      'ETag'             : etag
    });
  }
  res.end(buffer);
};

exports.replyNotModified = function(res) {
  res.writeHead(304, {
    'Connection'       : 'keep-alive',
    'Proxy-Connection' : 'keep-alive',
    'Cache-Control'    : 'max-age=31536000',
    'Expires'          : new Date(Date.now() + 31536000000).toUTCString()
  });
  res.end();
};

exports.replyNotFound = function(res) {
  res.writeHead(404, {
  });
  res.end();
};
