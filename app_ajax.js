var querystring = require('querystring');

var MAX_BODY = 1024;

// Extract a data object from the request message.
// cb = function(data) where data is Error or Object
exports.parse = function(req, cb) {
  var dataString;
  req.setEncoding('utf8');
  req.on('data', function (chunk) {
    if (dataString === undefined) {
      dataString = chunk;
    } else {
      dataString += chunk;
    }
    if (dataString.length > MAX_BODY) {
      return cb(new Error('app_ajax.parse: dataString exceeds ' + MAX_BODY));
    }
  });
  req.on('end', function() {
    if (dataString === undefined || dataString.length === 0) return cb({});
    try {
      var data = JSON.parse(dataString);
      if (data) {
        cb(data);
      } else {
        cb(new Error('\napp_ajax.parse: data is false from message body = ' + dataString));
      }
    } catch (err) {
      err.message += '\napp_ajax.parse: ' + err.message + ' for message body = ' + dataString;
      return cb(err);
    }
  });
};

// Send the client data as a JSON string.
exports.data = function(res, data) {
  if (data === undefined) {
    data = {};
  }
  var buf = new Buffer(JSON.stringify({'data' : data}), 'utf8');
  res.writeHead(200, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Content-Length': buf.length,
    'Pragma': 'no-cache',
    'Cache-Control': 'no-cache, no-store'
  });
  res.end(buf);
};

// Send the client an object with an error property set to 'unspecified error'.
exports.error = function(res, error) {
  if (error === undefined) error = new Error('unspecified error');
  var buf = new Buffer(JSON.stringify({'error': error.message}), 'utf8');
  res.writeHead(200, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Content-Length': buf.length,
    'Pragma': 'no-cache',
    'Cache-Control': 'no-cache, no-store'
  });
  res.end(buf);
};

// Tell client to login.
exports.login = function(res) {
  //exports.reply(res, { login: true });
  var buf = new Buffer(JSON.stringify({'login' : true}), 'utf8');
  res.writeHead(200, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Content-Length': buf.length,
    'Pragma': 'no-cache',
    'Cache-Control': 'no-cache, no-store'
  });
  res.end(buf);
};