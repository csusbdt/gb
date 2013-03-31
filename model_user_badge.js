var assert = require('assert');
var model = require('./model');

exports.create = function(user_badge, cb) {
  model.db.collection('user_badge_links').insert(
    user_badge,
    function(err) {
      model.db.close();
      if (err) return cb(err); 
      cb();
    }
  );
};

exports.getUserIdsByBadgeId = function(badge, cb) {
  model.db.collection('user_badge_links',{'uid' : true}).find(badge).toArray(function(err, user_badge_links){
    model.db.close();
    if (err) return cb(err);
    console.log('model_user_badge getUserIdsByBadgeId user_badge_links = '+ JSON.stringify(user_badge_links));
    var user_ids = user_badge_links.map(function(user_badge_link) {return user_badge_link.uid;});
    cb(user_ids);
  });    
};

exports.getBadgeIdsByUserId = function(user, cb) {
  model.db.collection('user_badge_links',{'bid' : true}).find(user).toArray(function(err, user_badge_links){
    model.db.close();
    if (err) return cb(err);
    console.log('model_user_badge getBadgeIdsByUserId user_badge_links = '+ JSON.stringify(user_badge_links));
    var badge_ids = user_badge_links.map(function(user_badge_link) {return user_badge_link.bid;});
    cb(badge_ids);
  });    
};
