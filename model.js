var Server      = require('mongodb').Server;
var MongoClient = require('mongodb').MongoClient;
var assert      = require('assert');

// Establish database connection pool.
// Export the database connection object.
// Throw any error to halt program.
exports.init = function(cb) {
  var serverOptions = {
    auto_reconnect: true, 
    poolSize: 20
  };
  var dbOptions = {
    retryMiliSeconds: 5000, 
    numberOfRetries: 4,
    w: 1
  };
  var connectOptions = {
    db: dbOptions,
    server: serverOptions
  };
  MongoClient.connect(process.env.MONGO_URI, connectOptions, function(err, db) {
    if (err) throw err;
    assert(db !== null);
    exports.db = db;
    cb();
  }); 
};