var client = require('./model').client;

exports.createBadge = function(user, cb) {
  model.mongoClient.open(function(err, mongoClient) {
    if (err) return cb(err);
    var db = mongoClient.db(model.dbName);
    db.collection('users').insert(
      user,
      function(err) {
        //mongoClient.close();
        if (err) return cb(err); 
        cb(); 
      }
    );  
  });
};