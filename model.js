var MongoClient = require('mongodb').MongoClient;
var Server      = require('mongodb').Server;

var host   = process.env.MONGO_HOST;
var port   = parseInt(process.env.MONGO_PORT, 10);
var dbName = process.env.MONGO_DB;

var serverOptions = {
  auto_reconnect: true, 
  poolSize: 20
};

var dbOptions = {
  retryMiliSeconds: 5000, 
  numberOfRetries: 4,
  w: 1
};

var server = new Server(host, port, serverOptions);
var mongoClient = new MongoClient(server, dbOptions);

exports.dbName = dbName;

exports.mongoClient = mongoClient;

// Make sure we can connect to database.
// Throw any error to halt program.
exports.init = function(cb) {
  exports.mongoClient.open(function(err, mongoClient) {
    mongoClient.db(dbName);
    if (err) throw err;
    mongoClient.close(); 
    cb();
  }); 
};