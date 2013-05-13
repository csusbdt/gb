var fs       = require('fs');
var zlib     = require('zlib');
var url      = require('url');
var crypto   = require('crypto');
var app_http = require('./app_http');

// This code returns "not found" when '..' appears in the url.

var extmap = {
  'png'  : { type: 'image/png',              gzip: true },
  'jpg'  : { type: 'image/jpg',              gzip: true },
  'db'  : { type: 'image/PNG',              gzip: true },
  'js'   : { type: 'application/javascript', gzip: true },
  'css'  : { type: 'text/css',               gzip: true },
  'ico'  : { type: 'image/x-icon',           gzip: true },
  'html' : { type: 'text/html',              gzip: true },
  'ogg'  : { type: 'audio/ogg',              gzip: false },
  'mp3'  : { type: 'audio/mp3',              gzip: false }
};

// len = the number of characters to skip over 
// to extract the filename from request url.
function FileRequestHandler(dir, len) {
  this.publicDir = dir;
  this.len = len;
  this.files = [];
}

exports.create = function(publicDir, len) {
  return new FileRequestHandler(publicDir, len);
}

// Insert file into files array.
// Throw exception if file already in array.
function insert(files, file) {
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
function find(files, filename) {
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

FileRequestHandler.prototype.handle = function(req, res) {
  var filename = url.parse(req.url).pathname;
  filename = filename.substr(this.len);
  var file = find(this.files, filename);
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
      
// Calculate and display memory consumption.
function displayStats(files) {
  var uncompressed = 0, compressed = 0;
  for (var i = 0; i < files.length; ++i) {
    uncompressed += files[i].data.length;
    if (files[i].gzip !== undefined) compressed += files[i].gzip.length;
  }
  console.log('memfile bytes, uncompressed: ' + Math.ceil(uncompressed / 1024 / 1024) + ' MB');
  console.log('memfile bytes, compressed:   ' + Math.ceil(compressed / 1024 / 1024) + ' MB');
}

FileRequestHandler.prototype.init = function(cb) {
  var self = this;
  readDir(this.publicDir, this.files, function() { displayStats(self.files); cb(); });
};
  
// Store contents of files in dir in the files array.
function readDir(dir, files, cb) {
  fs.readdir(dir, function(err, filenames) {
    if (err) throw err;
    var n = filenames.length;
    for (var i = 0; i < filenames.length; ++i) {
      readFile(files, dir + '/' + filenames[i], function() { if (--n === 0) cb(); });
    }
  });
}

function endsWith(str, ending) {
  if (str.length < ending) return false;
  return str.substr(str.length - ending.length) == ending;
}

function ignore(filename) {
  if (endsWith(filename, '.DS_Store')) return true;
  if (endsWith(filename, '.swp'))      return true;
  return false;
}

function readFile(files, filename, cb) {
  if (ignore(filename)) return cb();
  fs.stat(filename, function(err, stats) {
    if (err) throw err;
    if (stats.isDirectory()) {
      readDir(files, filename, cb);
    } else if (stats.isFile()) {
      readFile2(files, filename, cb);
    } else {
      throw new Error(filename + ' is not a file and not a directory.');
    }
  });
}

function readFile2(files, filename, cb) {
  var ext = getExt(filename);
  fs.readFile(filename, function (err, data) {
    if (err) throw err;
    var file = {
      name: filename.substr(filename.indexOf('/') + 1),
      type: ext.type,
      data: data,
      etag: app_http.etag(data)
    };
    insert(files, file);
    if (ext.gzip === false) return cb();
    zlib.gzip(file.data, function(err, result) {
      if (err) throw err;
      file.gzip = result;
      cb();
    });
  });
}