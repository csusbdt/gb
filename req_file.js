var fs       = require('fs');
var zlib     = require('zlib');
var url      = require('url');
var crypto   = require('crypto');
var app_http = require('./app_http');
// This code returns "not found" when '..' appears in the url.

var verPathLen = ('/' + process.env.APP_VER + '/').length;

var publicDir = 'public',
    files = [],
    extmap = {
      'png'  : { type: 'image/png',              gzip: true },
      'js'   : { type: 'application/javascript', gzip: true },
      'css'  : { type: 'text/css',               gzip: true },
      'ico'  : { type: 'image/x-icon',           gzip: true },
      'html' : { type: 'text/html',              gzip: true }
    };

// Insert file into files array.
// Throw exception if file already in array.
function insert(file) {
  // Keep files ordered by name so we can use binary search when servicing requests.
  files.push(null);
  var i = files.length - 1;
  for (; i > 0; --i) {
    if (files[i - 1].name < file.name) break;
    if (files[i - 1].name === file.name) throw new Error('duplicate insertion');
    files[i] = files[i - 1];
  }
  files[i] = file;
}

// Return file or null.  Uses binary search.
function find(filename) {
  // Locate file using binary search.
  var s = 0, 
      e = files.length - 1,
      m;
  while (s <= e) {
    m = Math.floor((s + e) / 2);
    if (files[m].name < filename) s = m + 1;
    else if (files[m].name > filename) e = m - 1;
    else return files[m];
  }
  return null;
}

exports.handle = function(req, res) {
  var path = url.parse(req.url).pathname;
  if (path === '/favicon.ico'){
    path = path.substr(1);
  }else{
    path = path.substr(verPathLen); 
  }  
  var file = find(path);
  if (file === null) {
    return app_http.replyNotFound(res);
  }
  if (req.headers['if-none-match'] === file.etag) {
    return app_http.replyNotModified(res);
  }
  if (file.gzip !== undefined && 
      req.headers['accept-encoding'] !== undefined && 
      req.headers['accept-encoding'].indexOf('gzip') !== -1) {
    return app_http.replyCached(res, file.gzip, file.type, file.etag, 'gzip');
  } else {
    return app_http.replyCached(res, file.data, file.type, file.etag);
  }
};

// initialization

(function() {

  var pendingReturns = 0,
      callback;           // to return back to main.js

  function getExt(filename) {
    var i = filename.lastIndexOf('.');
    if (i === -1) {
      throw new Error(filename + ' has no extension');
    }
    var ext = filename.substr(i + 1);
    if (extmap.hasOwnProperty(ext)) {
      return extmap[ext];
    } else {
      throw new Error('extension unknown: ' + ext);
    }
  }
      
  function start() { 
    ++pendingReturns;
  }

  function end() {
    if (--pendingReturns === 0) {
      displayStats();
      callback();
    }
  }

  // Calculate and display memory consumption.
  function displayStats() {
    var uncompressed = 0, compressed = 0;
    for (var i = 0; i < files.length; ++i) {
      uncompressed += files[i].data.length;
      if (files[i].gzip !== undefined) compressed += files[i].gzip.length;
    }
    console.log('memfile bytes, uncompressed: ' + Math.ceil(uncompressed / 1024 / 1024) + ' MB');
    console.log('memfile bytes, compressed:   ' + Math.ceil(compressed / 1024 / 1024) + ' MB');
  }

  exports.init = function(cb) {
    callback = cb;
    readDir(publicDir);
  };
  
  // Store contents of files in dir in the files array.
  function readDir(dir) {
    start();
    fs.readdir(dir, function(err, filenames) {
      if (err) throw err;
      for (var i = 0; i < filenames.length; ++i) {
        readFile(dir + '/' + filenames[i]);
      }
      end();
    });
  }

  function endsWith(str, ending) {
    if (str.length < ending) return false;
    return str.substr(str.length - ending.length) == ending;
  }

  function ignore(filename) {
    if (endsWith(filename, '.DS_Store')) return true;
    if (endsWith(filename, '.swp')) return true;
    return false;
  }

  function readFile(filename) {
    if (ignore(filename)) return;
    start();
    fs.stat(filename, function(err, stats) {
      if (stats.isDirectory()) {
        readDir(filename);
      } else if (stats.isFile()) {
        readFile2(filename);
      } else {
        throw new Error(filename + ' is not a file and not a directory.');
      }
      end();
    });
  }

  function readFile2(filename) {
    var ext = getExt(filename);
    start();
    fs.readFile(filename, function (err, data) {
      if (err) throw err;
      var file = {
        name: filename.substr(publicDir.length + 1),
        type: ext.type,
        data: data,
        etag: app_http.etag(data)
      };
      insert(file);
      if (ext.gzip === false) return end();
      start();
      zlib.gzip(file.data, function(err, result) {
        if (err) throw err;
        file.gzip = result;
        end();
      });
      end();
    });
  }
  
}());