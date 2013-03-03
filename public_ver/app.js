$(function() {
  var n = -1;
  var $_nextScreen;
  window.a = {};
  
  /* ------SCREEN Utilities-------- */
  a.createBtn = function(btnTxt){
    return $('<button>' + btnTxt + '</button>');
  };
  
  a.createDiv = function(text){
    if (text === undefined) text = '';
    return $('<div>' + text + '</div>');
  };
  
  a.createTxtBox = function(){
    return $('<input></input>');
  };
  
  a.createList = function(){
    return $('<ul></ul>');
  };
  /* ------------------------------------------------------------- */
  
  a.screen = function(screenName, speed){
    if (speed === undefined) speed = 300;
    a.screenInit(screenName);
    $('#'+a.currentScreen).fadeOut(speed, function() {$('#'+screenName).fadeIn(speed)});
    a.currentScreen = screenName;
  };
  
  a.currentScreen = 'loading';
  
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
  
  
  /* ------------------SCREEN INIT---------------------- */
  a.initTitle = function(){
    FB.api('/me', function(response) {
      console.log('Screen init title');
      $('#name').html('<a href="#profile"><img width="25" height="25" style="margin-right:5" src="http://graph.facebook.com/' + response.id + '/picture" />  '+response.name+'</a>');
    });
  };
  
  a.initGroupList = function(){
      
  };
  /* ---------------------------------------- */
  
  (function(){
    var initFuncs = {
      groups : a.initGroupList,
      title  : a.initTitle
    };
    a.screenInit = function(screenName){
      console.log('initFunc = ' + screenName);
      if (initFuncs.hasOwnProperty(screenName)) initFuncs[screenName](); 
    };
  }());
  
  fbAsyncInit();
 });