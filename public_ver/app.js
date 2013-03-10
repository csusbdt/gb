window.a = {};
a.creds = {};
a.m = {};

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
    screens.profile = new Screen('login');
  }());
  
  var currentScreen = screens.loading;
        
  a.screen = function(screenName, speed){
    if (speed === undefined) speed = 300;
    var newScreen = screens[screenName];
    if (newScreen.init) newScreen.init();
    currentScreen.transitionTo(speed, newScreen);
    currentScreen = newScreen;
  };

  screens.title.init = function(){
    FB.api('/me', function(response) {
      console.log('Screen init title');
      $('#name').html('<a href="#profile"><img width="25" height="25" style="margin-right:5" src="http://graph.facebook.com/' + response.id + '/picture" />  '+response.name+'</a>');
    });
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

a.m.readGroups = function(cb) { 
  $.ajax({
    url: '/op/read-groups',
    type: 'post',
    dataType: 'json',
    cache: false,
    data: JSON.stringify( { 'accessToken': a.creds.accessToken } )
  })
  .done(function(data) {
    console.log(JSON.stringify(data));
    //if (data.login !== undefined) {
      //a.relogin(function() { $saveBtn.click(); });
    //} else 
    if (data.error !== undefined) {
      console.log('error = ' + data.error);
      cb(data.error);
    } else {
      console.log('group is read');
      a.m.groups = data;
      cb();
    }
  })
  .fail(function(jqxhr, textStatus, errorThrown) {
    if (errorThrown) console.log('Error: ' + errorThrown);
    else console.log('Error: ' + textStatus);
  });
}; 



$('#saveGroup').click(function() { 
  console.log(JSON.stringify( { 'name': $('#gname').val(), 'desc': $('#gdesc').val(), 'accessToken': a.creds.accessToken } ));
  $.ajax({
    url: '/op/save-group',
    type: 'post',
    dataType: 'json',
    cache: false,
    data: JSON.stringify( { 'name': $('#gname').val(), 'desc': $('#gdesc').val(), 'accessToken': a.creds.accessToken } )
  })
  .done(function(data) {
    console.log(JSON.stringify(data));
    //if (data.login !== undefined) {
      //a.relogin(function() { $saveBtn.click(); });
    //} else 
    if (data.error !== undefined) {
      console.log('error = ' + data.error);
      //$numDiv.html(data.error);
    } else {
      console.log('group is saved');
      //$numDiv.append($('<span> saved</span>'));
    }
  })
  .fail(function(jqxhr, textStatus, errorThrown) {
    if (errorThrown) console.log('Error: ' + errorThrown);
    else console.log('Error: ' + textStatus);
  });
}); 

/* ----------------------------FB Business--------------------------------- */
a.fbRelogin = function(cb) {
console.log('a.relogin()');
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      a.creds.uid = response.authResponse.userID;
      a.creds.accessToken = response.authResponse.accessToken;
      cb();
    } else if (response.status === 'not_authorized') {
      a.screen.next('login');
    } else {
      var $relogin = $('<button>Login to Facebook</button>');
      $('.screen').hide();
      $('body').append($relogin);
      $relogin.click(function() {
        $relogin.remove();
        $('.screen').show();
        a.login(cb);
      });
    }
  }, true);
};

a.fbLogin = function(cb) {
  FB.login(function(response) {
    if (response.authResponse) {
      a.creds.uid = response.authResponse.userID;
      a.creds.accessToken = response.authResponse.accessToken;
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