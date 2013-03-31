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
    
    screens.loading = new Screen('loading');
    screens.groups  = new Screen('groups');
    screens.title   = new Screen('title');
    screens.badges  = new Screen('badges');
    screens.profile = new Screen('profile'); 
    screens.login = new Screen('login');
    screens.groupBadges = new Screen('groupBadges');
    screens.badgeMembers = new Screen('badgeMembers');
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
  
  screens.title.init = function(){
    FB.api('/me', function(response) {
      console.log('Screen init title');
      $('#name').html('<a href="#" onclick="a.screen(\'profile\')"><img width="25" height="25" style="margin-right:5" src="http://graph.facebook.com/' + response.id + '/picture" />  '+response.name+'</a>');
    });
  };
  
  screens.login.init = function(){
    screens.login.$mainDiv.html('<button class="btn btn-primary" type="button" onclick="a.fbLogin()">Facebook Login</button>');
    $('#loginModal').modal('show');
  };
  
  screens.groupBadges.init = function(){
    console.log('Curr Group = ' +JSON.stringify(a.v.currGroup));
    $('#groupname').html('<h2>'+ a.v.currGroup.name +'</h2>');
    if (a.v.currGroup.badges === undefined) screens.groupBadges.refresh();
  };
  
  screens.groupBadges.refresh = function(){   
    a.m.readGroupBadges(function() {
      screens.groupBadges.rebuild();
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
    a.v.currBadge.members.forEach(function(member, i){
        $('#badge_members_list').append(
          '<li class="span4">' +
            '<div class="thumbnail">' +
              '<h3>'+ member.name +'</h3>' +
              '<p>'+ member.uid +'</p>' +
              '<p>Status earned</p>' +
              '<p>photo, # badge earned</p>' +
              '<button id="group_edit" class="btn btn-primary" onclick="" type="button">' +
                '<i class="icon-certificate icon-white"></i> Assign (not done)</button>' +
            '</div>' +
          '</li>'
        );  
    });
  };
  
  screens.groupBadges.rebuild = function(){
    $('#group_badges_list > li').remove();
    a.v.currGroup.badges.forEach(function(badge, i){
        $('#group_badges_list').append(
          '<li class="span4">' +
            '<div class="thumbnail">' +
              '<h3>'+ badge.name +'</h3>' +
              '<p>'+ badge.desc +'</p>' +
              '<p>'+ badge.pict +'</p>' +
              '<button id="assign_badge" class="btn btn-primary" onclick="a.v.setCurrBadge('+i+')" type="button">' +
                '<i class="icon-user icon-white"></i> Assign Badge</button>' + 
            '</div>' +
          '</li>'
        );  
    });
  };
  
  screens.groups.rebuild = function(){
    $('#groups_list > li').remove();
    a.m.groups.forEach(function(group, i){
        $('#groups_list').append(
          '<li class="span4">' +
            '<div class="thumbnail">' +
              '<h3>'+ group.name +'</h3>' +
              '<p>'+ group.desc +'</p>' +
              '<button id="group_edit" class="btn btn-primary" onclick="a.v.setCurrGroup('+i+')" type="button">' +
                '<i class="icon-certificate icon-white"></i> Badges</button>' +
            '</div>' +
          '</li>'
        );  
    });
  };
  
  screens.groups.init = function(){
    if (a.m.groups === undefined) screens.groups.refresh();
  };
  
  /* ------SCREEN Utilities-------- 
  a.Screen.createBtn = function(btnTxt){
    return $('<button>' + btnTxt + '</button>');
  };
  
  a.Screen.createDiv = function(text){
    if (text === undefined) text = '';
    return $('<div>' + text + '</div>');
  };
  
  a.Screen.createTxtBox = function(){
    return $('<input></input>');
  };
  
  a.Screen.createList = function(){
    return $('<ul></ul>');
  };
  ------------------------------------------------------------- */
});
/*-----   END OF SCREENS ------------------ */

/*------------------ MODEL --------------------- */
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

a.m.readGroupBadges = function(cb) { 
  $.ajax({
    url: '/op/read-badges-by-group',
    type: 'post',
    dataType: 'json',
    cache: false,
    data: JSON.stringify( { 'accessToken': a.creds.accessToken, 'gid' : a.v.currGroup._id } )
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

a.m.readBadgeMembers = function(cb) { 
  $.ajax({
    url: '/op/read-badge-members',
    type: 'post',
    dataType: 'json',
    cache: false,
    data: JSON.stringify( { 'accessToken': a.creds.accessToken, 'gid' : a.v.currGroup._id, 'bid' : a.v.currBadge._id } )
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
      a.v.currBadge.members.sort(function(a,b) { return a.name < b.name ? -1 : 1});
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
    data: JSON.stringify( { 'name': $('#gname').val(), 'desc': $('#gdesc').val(), 'accessToken': a.creds.accessToken } )
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
    data: JSON.stringify( { 'name': $('#bname').val(), 'desc': $('#bdesc').val(), 'pict': $('#bpict').val(), 'gid': a.v.currGroup._id, 'accessToken': a.creds.accessToken } )
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
a.v.setCurrGroup = function(i) {
  $('#group_badges_list > li').remove();
  a.v.currGroup = a.m.groups[i];
  a.screen('groupBadges');
};

a.v.currBadge = null;
a.v.setCurrBadge = function(i) {
  $('#group_members_list > li').remove();
  a.v.currBadge = a.v.currGroup.badges[i];
  a.screen('badgeMembers');
};
/* ----------------- END OF VIEW ------------- */


/* ----------------------------FB Business--------------------------------- */
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