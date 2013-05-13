var assert = require('assert');
var model = require('./model');

exports.create = function(badge, cb) {
  model.db.collection('badges').insert(
    badge,
    function(err) {
      model.db.close();
      if (err) return cb(err); 
      cb();
    }
  );  
};

exports.getByIds = function(bids, cb){
  console.log('model badge, badge ids =' +JSON.stringify(bids));
  model.db.collection('badges').find({'_id' : {$in: bids} }).toArray(function(err, badges){
    model.db.close();
    if (err) return cb(err);
    console.log('model_badge getByIds badges array = '+ JSON.stringify(badges));  
    cb(badges);
  });
};

exports.getAll = function(cb){
  model.db.collection('badges').find().toArray(function(err, badges){
    model.db.close();
    if (err) return cb(err);
    console.log('model_badge getAll groups array = '+ JSON.stringify(badges));  
    cb(badges);
  });
};

// return badges list earned by uid
/*
exports.readMyBadges = function(user, cb) {
  model.db.collection('user_badge_links',{'bid' : true}).find(user).toArray(function(err, user_badge_links){
    if (err) {model.db.close(); return cb(err);}
    console.log('model_badge readMyBadges user_badge_links = '+ JSON.stringify(user_badge_links));
    
    var badge_ids = user_badge_links.map(function(user_badge_link) {return user_badge_link.bid;});
    model.db.collection('badges').find({'_id' : {$in: badge_ids} }).toArray(function(err, badges){
      model.db.close();
      if (err) return cb(err);
      console.log('model_badge readMyBadges badges array = '+ JSON.stringify(badges));  
      user.badges = badges;
      cb(badges);
    });
  });    
};

//return members list of a badge
exports.readBadgeMembers = function(badge, cb) {
  model.db.collection('badge_member_links',{'uid' : true}).find(badge).toArray(function(err, badge_member_links){
    if (err) {model.db.close(); return cb(err);}
    console.log('model_badge readBadgeMembers badge_member_links = '+ JSON.stringify(badge_member_links));
    
    var member_ids = badge_member_links.map(function(badge_member_link) {return badge_member_link.gid;});
    model.db.collection('users').find({'_id' : {$in: member_ids} }).toArray(function(err, members){
      model.db.close();
      if (err) return cb(err);
      console.log('model_badge readBadgeMembers members array = '+ JSON.stringify(members));  
      badge.members = members;
      cb();
    });
    
  });    
};
*/
