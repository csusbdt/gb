var assert = require('assert');
var model = require('./model');

exports.create = function(group_badge, cb) {
  model.db.collection('group_badge_links').insert(
    group_badge,
    function(err) {
      model.db.close();
      if (err) return cb(err); 
      cb();
    }
  );
};

exports.getBadgeIdsByGroupId = function(group, cb) {
  model.db.collection('group_badge_links',{'bid' : true}).find(group).toArray(function(err, group_badge_links){
    model.db.close();
    if (err) return cb(err);
    console.log('model_group_badge getBadgeIdsByGroupId group_badge_links = '+ JSON.stringify(group_badge_links));
    var badge_ids = group_badge_links.map(function(group_badge_link) {return group_badge_link.bid;});
    cb(badge_ids);
  });    
};