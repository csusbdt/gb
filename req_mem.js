var app_http = require('./app_http');

exports.handle = function(req, res) {
  var usage = process.memoryUsage(),
      page = '<p>Heroku limit = 512 MB</p>' + 
             '<p>rss = '       + Math.ceil(usage.rss       / 1024 / 1024) + ' MB</p>' +  
             '<p>heapTotal = ' + Math.ceil(usage.heapTotal / 1024 / 1024) + ' MB</p>' +
             '<p>heapUsed = '  + Math.ceil(usage.heapUsed  / 1024 / 1024) + ' MB</p>';
      page = new Buffer(page, 'utf8');
  app_http.replyNotCached(res, page);
}