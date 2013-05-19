window.a = {};
a.creds = {};
a.m = {};
a.c = {};
a.v = {};

/* ------------------SCREENS---------------------- */
$(function() {
  var screens = {};
    
  (function (){
    Screen = function(name) {
      this.name = name;
      this.$mainDiv = $('#'+name);
    };
    
    Screen.prototype.transitionTo = function(speed, newScreen){
      this.$mainDiv.fadeOut(speed, function() {
        newScreen.$mainDiv.fadeIn(speed);
      });
    };    
    
    screens.loading     = new Screen('loading');
    screens.groups      = new Screen('groups');
    screens.title       = new Screen('title');
    //screens.badges      = new Screen('badges');
    screens.myBadges    = new Screen('myBadges');
    screens.profile     = new Screen('profile'); 
    screens.login       = new Screen('login');
    screens.groupBadges = new Screen('groupBadges');
    screens.groupMembers= new Screen('groupMembers');
    screens.badgeMembers= new Screen('badgeMembers');
    screens.findGroups  = new Screen('findGroups');
  }());
  
  var currentScreen = screens.loading;
        
  a.screen = function(screenName, speed){
    if (speed === undefined) speed = 300;
    var newScreen = screens[screenName];
    if (newScreen.init) newScreen.init();
    currentScreen.transitionTo(speed, newScreen);
    currentScreen = newScreen;
  };
  
  a.refresh = function(){
    currentScreen.refresh();
  };

  a.rebuild = function(){
    currentScreen.rebuild();
  };
  
  screens.profile.init = function(){
    FB.api('/me', function(response) {
      console.log('Screen profile title');
      //$('#name').html('<a href="#" onclick="a.screen(\'profile\')"><img width="25" height="25" style="margin-right:5" src="http://graph.facebook.com/' + response.id + '/picture" />  '+response.name+'</a>');
      var $li = $('<li class="span4"></li>');
      var $div = $('<div class="thumbnail"></div>');
      $div.append('<h3>'+ response.name +'</h3>');
      $div.append('<img src="http://graph.facebook.com/' + response.id + '/picture" />');
      var $btn = $('<button class="btn btn-primary" type="button"></button>');
      $btn.append('<i class="icon-certificate icon-white"></i> Share GradeBadge');
      //$btn.attr('id', 'something');
      $btn.click(function(){
        a.fbPostGB();;
      });
      $div.append($btn);
      $li.append($div);
      $('#profile_profile').append($li);
    });
  
  };
  
  screens.myBadges.init = function(){
    console.log('myBadges init');
    if (a.m.myBadges === undefined) screens.myBadges.refresh();
  };
  
  screens.myBadges.refresh = function(){
    a.m.readMyBadges(function() {
      screens.myBadges.rebuild();
    });
  };
  
  screens.myBadges.rebuild = function(){
    $('#my_badges_list > li').remove();
    a.m.myBadges.forEach(function(badge, i){
      var $li = $('<li class="span4"></li>');
      var $div = $('<div class="thumbnail"></div>');
      $div.append('<img src="http://'+ window.location.host +'/'+ badge.pict +'"/>');
      $div.append('<h3>'+ badge.name +'</h3>');
      //$div.append('<p>'+ badge.desc +'</p>');
      var $btn = $('<button class="btn btn-primary" type="button"></button>');
      $btn.append('<i class="icon-certificate icon-white"></i> Share FB');
      //$btn.attr('id', 'something');
      $btn.click(function(){
        a.fbPostBadge(badge);
      });
      $div.append($btn);
      $li.append($div);
      $('#my_badges_list').append($li);    
    });
  };
  
  screens.findGroups.rebuild = function(){
    $('#findgroups_list > li').remove();
    a.m.anyGroups.forEach(function(group, i){
      var $li = $('<li class="span4"></li>');
      var $div = $('<div class="thumbnail"></div>');
      $div.append('<h3>'+ group.name +'</h3>');
      $div.append('<p>'+ group.desc +'</p>');
      var $btn = $('<button class="btn btn-primary" type="button"></button>');
      $btn.append('<i class="icon-certificate icon-white"></i> Join');
      //$btn.attr('id', 'something');
      $btn.click(function(){
        screens.findGroups.joinGroupBtn(i);
      });
      $div.append($btn);
      $li.append($div);
      $('#findgroups_list').append($li);    
    });
  };
  
  screens.findGroups.joinGroupBtn = function(i){
    a.m.joinGroup(a.m.anyGroups[i]._id, function(){
      a.fbPostGroup(a.m.anyGroups[i]);  
      a.screen('myBadges');
    });
  };
  
  screens.findGroups.refresh = function(){   
    a.m.readAnyGroups(function() {
      screens.findGroups.rebuild();
    });
  };
  
  screens.findGroups.init = function(){
    console.log('findGroups init');
    if (a.m.anyGroups === undefined) screens.findGroups.refresh();
  };
  
  screens.title.init = function(){
    FB.api('/me', function(response) {
      console.log('Screen init title');
      $('#name').html('<a href="#" onclick="a.screen(\'profile\')"><img width="25" height="25" style="margin-right:5" src="http://graph.facebook.com/' + response.id + '/picture" />  '+response.name+'</a>');
      var $li = $('<li class="span4"></li>');
      var $div = $('<div class="thumbnail"></div>');
      $div.append('<h3>'+ response.name +'</h3>');
      $div.append('<img src="http://graph.facebook.com/' + response.id + '/picture" />');
      var $btn = $('<button class="btn btn-primary" type="button"></button>');
      $btn.append('<i class="icon-certificate icon-white"></i> Share GradeBadge');
      //$btn.attr('id', 'something');
      $btn.click(function(){
        a.fbPostGB();
      });
      $div.append($btn);
      $li.append($div);
      $('#profile_title').append($li);
    });
  };
  
  screens.login.init = function(){
    screens.login.$mainDiv.html('<button class="btn btn-primary" type="button" onclick="a.fbLogin()">Facebook Login</button>');
    $('#loginModal').modal('show');
  };
  
  screens.groupBadges.init = function(){
    console.log('Curr Group = ' +JSON.stringify(a.v.currGroup));
    $('#groupname_b').html('<h2>'+ a.v.currGroup.name +'</h2>');
    if (a.v.currGroup.badges === undefined) screens.groupBadges.refresh();
  };
  
  screens.groupBadges.refresh = function(){   
    a.m.readGroupBadges(function() {
      screens.groupBadges.rebuild();
    });
  };
  
  screens.groupMembers.init = function(){
    console.log('Curr Group = ' +JSON.stringify(a.v.currGroup));
    $('#groupname_m').html('<h2>'+ a.v.currGroup.name +'</h2>');
    if (a.v.currGroup.members === undefined) screens.groupMembers.refresh();
  };
  
  screens.groupMembers.refresh = function(){   
    a.m.readGroupMembers(function() {
      screens.groupMembers.rebuild();
    });
  };
  
  screens.badgeMembers.init = function(){
    console.log('Curr Badge = ' +JSON.stringify(a.v.currBadge));
    $('#badgename').html('<h2>'+ a.v.currBadge.name +'</h2>');
    if (a.v.currBadge.members === undefined) screens.badgeMembers.refresh();
  };
  
  screens.badgeMembers.refresh = function(){   
    a.m.readBadgeMembers(function() {
      screens.badgeMembers.rebuild();
    });
  };
  
  screens.groups.refresh = function(){   
    a.m.readGroups(function() {
      screens.groups.rebuild();
    });
  };
  
  screens.badgeMembers.rebuild = function(){
    $('#badge_members_list > li').remove();
    var qs = 'SELECT+uid,+name,+pic_square+FROM+user+WHERE';
    a.v.currBadge.members.forEach(function(member, i){
      qs+= '+uid='+member.uid+'+OR';
    });
    qs = qs.substring(0, qs.length - 3); // to remove the last +OR   
      
    $.ajax({
    url: 'https://graph.facebook.com/fql?q=' + qs + '&access_token=' + a.creds.accessToken,
    type: "GET",
    dataType: 'json'
    })
    .done(function(data) {
      if (data.data === undefined) {
        alert('fail');
        return;
      }
      data.data.forEach(function(member) {
        var $li = $('<li class="span4"></li>');
        var $div = $('<div class="thumbnail"></div>');
        $div.append('<h3>'+ member.name +' <img src="'+ member.pic_square +'"/></h3>');
        var $btn = $('<button class="btn btn-primary" type="button"></button>');
        $btn.append('<i class="icon-certificate icon-white"></i> Assign Badge');
        //$btn.attr('id', 'something');
        $btn.click(function(){
          screens.badgeMembers.assignBadgeBtn(member.uid, a.v.currBadge);
        });
        $div.append($btn);
        $li.append($div);
        $('#badge_members_list').append($li);      
      });
    })
    .fail(function(jqXHR, textStatus) {
    console.log('textStatus: ' + textStatus);
    console.log(jqXHR);
    });
  };    
  
  screens.badgeMembers.assignBadgeBtn = function(uid, badge){
    a.m.assignBadge(uid, badge._id, function(){
      a.fbPostBadge(badge);
      //a.screen('myBadges');
    });  
  };
  
  screens.groupMembers.rebuild = function(){
    $('#group_members_list > li').remove();
    var qs = 'SELECT+uid,+name,+pic_square+FROM+user+WHERE';
    a.v.currGroup.members.forEach(function(member, i){
      qs+= '+uid='+member.uid+'+OR';
    });
    qs = qs.substring(0, qs.length - 3); // to remove the last +OR   
      
    $.ajax({
    url: 'https://graph.facebook.com/fql?q=' + qs + '&access_token=' + a.creds.accessToken,
    type: "GET",
    dataType: 'json'
    })
    .done(function(data) {
      if (data.data === undefined) {
        alert('fail');
        return;
      }
      data.data.forEach(function(member) {
        var $li = $('<li class="span4"></li>');
        var $div = $('<div class="thumbnail"></div>');
        $div.append('<h3>'+ member.name +' <img src="'+ member.pic_square +'"/></h3>');
        //var $btn = $('<button class="btn btn-primary" type="button"></button>');
        //$btn.append('<i class="icon-certificate icon-white"></i> Assign Badge');
        //$btn.attr('id', 'something');
        //$btn.click(function(){
          //screens.badgeMembers.assignBadgeBtn(member.uid);
        //});
        //$div.append($btn);
        $li.append($div);
        $('#group_members_list').append($li);      
      });
    })
    .fail(function(jqXHR, textStatus) {
    console.log('textStatus: ' + textStatus);
    console.log(jqXHR);
    });
  };
  
  screens.groupBadges.rebuild = function(){
    $('#group_badges_list > li').remove();
    a.v.currGroup.badges.forEach(function(badge, i){
      var $li = $('<li class="span4"></li>');
      var $div = $('<div class="thumbnail"></div>');
      $div.append('<img src="http://' + window.location.host +'/'+ badge.pict +'"/>');
      $div.append('<h3>'+ badge.name +'</h3>');
      //$div.append('<p>'+ badge.desc +'</p>');
      var $btn = $('<button class="btn btn-primary" type="button"></button>');
      $btn.append('<i class="icon-certificate icon-white"></i> Assign Badge');
      //$btn.attr('id', 'something');
      $btn.click(function(){
        screens.groupBadges.selectBadgeBtn(i);
      });
      $div.append($btn);
      $li.append($div);
      $('#group_badges_list').append($li);    
    });
  };
  
  screens.groupBadges.selectBadgeBtn = function(i) {
    a.v.currBadge = a.v.currGroup.badges[i];
    screens.groupBadges.rebuild();
    a.screen('badgeMembers');
  };
  
  screens.groups.rebuild = function(){
    $('#groups_list > li').remove();
    a.m.groups.forEach(function(group, i){
        $('#groups_list').append(
          '<li class="span4">' +
            '<div class="thumbnail">' +
              '<h3>'+ group.name +'</h3>' +
              '<p>'+ group.desc +'</p>' +
              '<button id="group_edit" class="btn btn-primary" onclick="a.v.selectGroupBtn('+i+', true)" type="button">' +
                '<i class="icon-certificate icon-white"></i> Badges</button>' +
              '<button id="group_member" class="btn btn-primary" onclick="a.v.selectGroupBtn('+i+', false)" type="button">' +
                '<i class="icon-certificate icon-white"></i> Members</button>' +  
            '</div>' +
          '</li>'
        );  
    });
  };
  
  screens.groups.selectGroupBtn = function(i) {
    a.v.currGroup = a.m.groups[i];
    //screens.groupBadges.rebuild();
    a.screen('groupBadges');
  };
  
  screens.groups.init = function(){
    if (a.m.groups === undefined) screens.groups.refresh();
  };
 
});
/*-----   END OF SCREENS ------------------ */

/*------------------ MODEL --------------------- */
a.m.readMyBadges = function(cb) { 
  $.ajax({
    url: '/op/read-my-badges',
    type: 'post',
    dataType: 'json',
    cache: false,
    data: JSON.stringify( { 'accessToken': a.creds.accessToken } )
  })
  .done(function(data) {
    console.log('app.js data = '+ JSON.stringify(data));
    //if (data.login !== undefined) {
      //a.relogin(function() { $saveBtn.click(); });
    //} else 
    if (data.error !== undefined) {
      console.log('error = ' + data.error);
      cb(data.error);
    } else {
      console.log('badges are read');
      a.m.myBadges = data.data;
      a.m.myBadges.sort(function(a,b) { return a.name < b.name ? -1 : 1});
      cb();
    }
  })
  .fail(function(jqxhr, textStatus, errorThrown) {
    if (errorThrown) console.log('Error: ' + errorThrown);
    else console.log('Error: ' + textStatus);
  });
}; 

a.m.readGroups = function(cb) { 
  $.ajax({
    url: '/op/read-groups-by-admin',
    type: 'post',
    dataType: 'json',
    cache: false,
    data: JSON.stringify( { 'accessToken': a.creds.accessToken } )
  })
  .done(function(data) {
    console.log('app.js data = '+ JSON.stringify(data));
    //if (data.login !== undefined) {
      //a.relogin(function() { $saveBtn.click(); });
    //} else 
    if (data.error !== undefined) {
      console.log('error = ' + data.error);
      cb(data.error);
    } else {
      console.log('group is read');
      a.m.groups = data.data;
      a.m.groups.sort(function(a,b) { return a.name < b.name ? -1 : 1});
      cb();
    }
  })
  .fail(function(jqxhr, textStatus, errorThrown) {
    if (errorThrown) console.log('Error: ' + errorThrown);
    else console.log('Error: ' + textStatus);
  });
}; 

a.m.readAnyGroups = function(cb) { 
  $.ajax({
    url: '/op/read-any-groups',
    type: 'post',
    dataType: 'json',
    cache: false,
    data: JSON.stringify( { 'accessToken': a.creds.accessToken } )
  })
  .done(function(data) {
    console.log('app.js data = '+ JSON.stringify(data));
    //if (data.login !== undefined) {
      //a.relogin(function() { $saveBtn.click(); });
    //} else 
    if (data.error !== undefined) {
      console.log('error = ' + data.error);
      cb(data.error);
    } else {
      console.log('group is read');
      a.m.anyGroups = data.data;
      a.m.anyGroups.sort(function(a,b) { return a.name < b.name ? -1 : 1});
      cb();
    }
  })
  .fail(function(jqxhr, textStatus, errorThrown) {
    if (errorThrown) console.log('Error: ' + errorThrown);
    else console.log('Error: ' + textStatus);
  });
}; 

a.m.joinGroup = function(gid, cb) { 
  $.ajax({
    url: '/op/join-group',
    type: 'post',
    dataType: 'json',
    cache: false,
    data: JSON.stringify( { 'accessToken': a.creds.accessToken, data:{ 'gid': gid } } )
  })
  .done(function(data) {
    console.log('app.js data = '+ JSON.stringify(data));
    //if (data.login !== undefined) {
      //a.relogin(function() { $saveBtn.click(); });
    //} else 
    if (data.error !== undefined) {
      console.log('error = ' + data.error);
      cb(data.error);
    } else {
      console.log('group_member linked');
      cb();
    }
  })
  .fail(function(jqxhr, textStatus, errorThrown) {
    if (errorThrown) console.log('Error: ' + errorThrown);
    else console.log('Error: ' + textStatus);
  });
}; 

a.m.assignBadge = function(uid, bid, cb) { 
  $.ajax({
    url: '/op/assign-badge',
    type: 'post',
    dataType: 'json',
    cache: false,
    data: JSON.stringify( { 'accessToken': a.creds.accessToken, data: {'uid': uid, 'bid': bid }} )
  })
  .done(function(data) {
    console.log('app.js data = '+ JSON.stringify(data));
    //if (data.login !== undefined) {
      //a.relogin(function() { $saveBtn.click(); });
    //} else 
    if (data.error !== undefined) {
      console.log('error = ' + data.error);
      cb(data.error);
    } else {
      console.log('badge assigned linked');
      cb();
    }
  })
  .fail(function(jqxhr, textStatus, errorThrown) {
    if (errorThrown) console.log('Error: ' + errorThrown);
    else console.log('Error: ' + textStatus);
  });
}; 


a.m.readGroupBadges = function(cb) { 
  $.ajax({
    url: '/op/read-badges-by-group',
    type: 'post',
    dataType: 'json',
    cache: false,
    data: JSON.stringify( { 'accessToken': a.creds.accessToken, data: { 'gid' : a.v.currGroup._id }} )
  })
  .done(function(data) {
    console.log('app.js data = '+ JSON.stringify(data));
    //if (data.login !== undefined) {
      //a.relogin(function() { $saveBtn.click(); });
    //} else 
    if (data.error !== undefined) {
      console.log('error = ' + data.error);
      cb(data.error);
    } else {
      console.log('badges are read');
      a.v.currGroup.badges = data.data;
      a.v.currGroup.badges.sort(function(a,b) { return a.name < b.name ? -1 : 1});
      cb();
    }
  })
  .fail(function(jqxhr, textStatus, errorThrown) {
    if (errorThrown) console.log('Error: ' + errorThrown);
    else console.log('Error: ' + textStatus);
  });
}; 

a.m.readGroupMembers = function(cb) { 
  $.ajax({
    url: '/op/read-members-by-group',
    type: 'post',
    dataType: 'json',
    cache: false,
    data: JSON.stringify( { 'accessToken': a.creds.accessToken, data: {'gid' : a.v.currGroup._id }} )
  })
  .done(function(data) {
    console.log('app.js data = '+ JSON.stringify(data));
    //if (data.login !== undefined) {
      //a.relogin(function() { $saveBtn.click(); });
    //} else 
    if (data.error !== undefined) {
      console.log('error = ' + data.error);
      cb(data.error);
    } else {
      console.log('badges are read');
      a.v.currGroup.members = data.data;
      //a.v.currGroup.members.sort(function(a,b) { return a.name < b.name ? -1 : 1});
      cb();
    }
  })
  .fail(function(jqxhr, textStatus, errorThrown) {
    if (errorThrown) console.log('Error: ' + errorThrown);
    else console.log('Error: ' + textStatus);
  });
}; 

a.m.readBadgeMembers = function(cb) { 
  $.ajax({
    url: '/op/read-badge-members',
    type: 'post',
    dataType: 'json',
    cache: false,
    data: JSON.stringify( { 'accessToken': a.creds.accessToken, data: { 'gid' : a.v.currGroup._id, 'bid' : a.v.currBadge._id }} )
  })
  .done(function(data) {
    console.log('app.js data = '+ JSON.stringify(data));
    //if (data.login !== undefined) {
      //a.relogin(function() { $saveBtn.click(); });
    //} else 
    if (data.error !== undefined) {
      console.log('error = ' + data.error);
      cb(data.error);
    } else {
      console.log('members are read');
      a.v.currBadge.members = data.data;
      //a.v.currBadge.members.sort(function(a,b) { return a.name < b.name ? -1 : 1});
      cb();
    }
  })
  .fail(function(jqxhr, textStatus, errorThrown) {
    if (errorThrown) console.log('Error: ' + errorThrown);
    else console.log('Error: ' + textStatus);
  });
}; 

/*----------- END OF MODEL ---------------- */

/*------------------- CONTROLER ---------------- */
a.c.saveNewGroup = function() { 
  //console.log(JSON.stringify( { 'name': $('#gname').val(), 'desc': $('#gdesc').val(), 'accessToken': a.creds.accessToken } ));
  $.ajax({
    url: '/op/save-group',
    type: 'post',
    dataType: 'json',
    cache: false,
    data: JSON.stringify( {'accessToken': a.creds.accessToken, data: { 'name': $('#gname').val(), 'desc': $('#gdesc').val() }} )
  })
  .done(function(data) {
    console.log(JSON.stringify(data));
    
    if (data.login !== undefined) {
      a.fbRelogin(function() { $saveBtn.click(); });
    } else 
    if (data.error !== undefined) {
      console.log('error = ' + data.error);
      //$numDiv.html(data.error);
    }else{
      console.log('group is saved, id = ' + JSON.stringify(data.data));
      $('#addGroupModal').hide();
      //a.screen('groups');
      a.m.groups.push({'_id': data.data.gid, 'name': $('#gname').val(), 'desc': $('#gdesc').val() });
      a.rebuild();
    }
  })
  .fail(function(jqxhr, textStatus, errorThrown) {
    if (errorThrown) console.log('Error: ' + errorThrown);
    else console.log('Error: ' + textStatus);
  });
}; 

a.c.saveNewBadge = function() { 
  $.ajax({
    url: '/op/save-badge',
    type: 'post',
    dataType: 'json',
    cache: false,
    data: JSON.stringify( {'accessToken': a.creds.accessToken, data: { 'name': $('#bname').val(), 'desc': $('#bdesc').val(), 'pict': $('#bpict').val(), 'gid': a.v.currGroup._id }} )
  })
  .done(function(data) {
    console.log(JSON.stringify(data));
    
    if (data.login !== undefined) {
      a.fbRelogin(function() { $saveBtn.click(); });
    } else if (data.error !== undefined) {
      console.log('error = ' + data.error);
      //$numDiv.html(data.error);
    }else{
      console.log('badge is saved, id = ' + JSON.stringify(data.data));
      $('#addBadgeModal').hide();
      a.screen('groupBadges');
      a.v.currGroup.badges.push({'_id': data.data.bid, 'name': $('#bname').val(), 'desc': $('#bdesc').val(), 'pict': $('#bpict').val(), 'gid': a.v.currGroup._id });
      a.rebuild();
    }
  })
  .fail(function(jqxhr, textStatus, errorThrown) {
    if (errorThrown) console.log('Error: ' + errorThrown);
    else console.log('Error: ' + textStatus);
  });
}; 


/* ----------------- END OF CONTROLLER ------------- */

/*------------------ VIEW ----------------- */
a.v.currGroup = null;

a.v.selectGroupBtn = function(i, option) {
  a.v.currGroup = a.m.groups[i];
  //screens.groupBadges.rebuild();
  if (option)
    a.screen('groupBadges');
  else
    a.screen('groupMembers');
};

a.v.currBadge = null;

/* ----------------- END OF VIEW ------------- */


/* ----------------------------FB Business--------------------------------- */
a.fbPostBadge = function(badge){
  FB.ui(
    {
      method: 'feed',
      name: 'I just earned a badge: ' + badge.name,
      link: 'http://'+ window.location.host,
      picture: 'http://'+ window.location.host +'/'+ badge.pict,
      caption: 'GradeBadge',
      description: 'Badge Desription: ' + badge.desc
    },
    function(response) {
      if (response && response.post_id) {
        console.log('Post was published.');
      } else {
        console.log('Post was NOT published.');
      }
    }
  );  
};

a.fbPostGroup = function(group){
  FB.ui(
    {
      method: 'feed',
      name: 'I just joined a group: ' + group.name,
      link: 'http://'+ window.location.host,
      picture: 'http://'+ window.location.host +'/group.jpg',
      caption: 'GradeBadge',
      description: 'Group Desription: ' + group.desc
    },
    function(response) {
      if (response && response.post_id) {
        console.log('Post was published.');
      } else {
        console.log('Post was NOT published.');
      }
    }
  );  
};

a.fbPostGB = function(){
  FB.ui(
    {
      method: 'feed',
      name: 'Check out GradeBadge',
      link: 'http://'+ window.location.host,
      picture: 'http://'+ window.location.host +'/group.jpg',
      caption: 'GradeBadge',
      description: 'Join millions other people who have received badges'
    },
    function(response) {
      if (response && response.post_id) {
        console.log('Post was published.');
      } else {
        console.log('Post was NOT published.');
      }
    }
  );  
};

a.fbRelogin = function(cb) {
console.log('a.relogin()');
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      a.creds.uid = response.authResponse.userID;
      a.creds.accessToken = response.authResponse.accessToken;
      cb();
    } else if (response.status === 'not_authorized') {
      //a.screen.next('login');
    } else {
      //var $relogin = $('<button>Login to Facebook</button>');
      //$('.screen').hide();
      //$('body').append($relogin);
      //$relogin.click(function() {
      //  $relogin.remove();
      //  $('.screen').show();
      //  a.login(cb);
      }
  }); 
};

a.fbLogin = function(cb) {
  FB.login(function(response) {
    if (response.authResponse) {
      a.creds.uid = response.authResponse.userID;
      a.creds.accessToken = response.authResponse.accessToken;
      $('#loginModal').modal('hide');
      a.screen('title');
      //cb('');
    } else {
      a.screen('login');
      //cb('Login failed.');
    }
  });
};
    
a.fbInit = function (fbAppId) {
  FB.init({
    appId      : fbAppId,
    channelUrl : '://' + window.location.host + '/channel.html',
    status     : false,  // check the login status upon init?
    cookie     : false,  // set sessions cookies?
    xfbml      : false
  });
  FB.Canvas.setAutoGrow();
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      a.creds.uid = response.authResponse.userID;
      a.creds.accessToken = response.authResponse.accessToken;
      a.screen('title');
    } else {
      a.screen('login');
    }
  });
};
  /* ------------------------------------------------------------- */
  
fbAsyncInit();
