var client = require('./model').client;

// This is using save, because it will check 
// if the uid is exist then it will update the last_login timestamp 
// otherwise it will create new record.
exports.createUser = function(user, cb) {
  model.mongoClient.open(function(err, mongoClient) {
    if (err) return cb(err);
    var db = mongoClient.db(model.dbName);
    db.collection('users').save(
      user,
      function(err) {
        //mongoClient.close();
        if (err) return cb(err); 
        cb(); 
      }
    );  
  });
};