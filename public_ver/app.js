window.a = {};

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

 
/* ----------------------------FB Business--------------------------------- */
a.fbLogin = function(cb) {
  FB.login(function(response) {
    if (response.authResponse) {
      //console.log('?uid=' + response.authResponse.userID);
      //console.log('&token=' + response.authResponse.accessToken);
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
      //console.log('?uid=' + response.authResponse.userID);
      //console.log('&token=' + response.authResponse.accessToken);
      a.screen('title');
    } else {
      a.screen('login');
    }
  });
};
  /* ------------------------------------------------------------- */
  
fbAsyncInit();