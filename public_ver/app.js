$(function() {
  var n = -1;
  var $_nextScreen;
  window.a = {};
  
  a.doneScreen = function($nextScreen, speed){
    if (speed === undefined) speed = 300;
    if ($nextScreen !== undefined){
      $_nextScreen = $nextScreen;
    }
    if (--n !== 0) return;
    $('.screen').remove();
    $_nextScreen.addClass('screen');
    $('body').append($_nextScreen);        
    $_nextScreen.fadeIn(speed, function() { n = -1; });
  };
       
  a.screen = function(screenName, speed) {
    if (n !== -1) return;  // don't allow more than one transition at a time
    n = 2;
    if (speed === undefined) speed = 300;
    
    var ref = document.getElementsByTagName('script')[0],
        screenJs = document.createElement('script');
    screenJs.async = true;
    screenJs.src = screenName + '.js';
    ref.parentNode.insertBefore(screenJs, ref);
      
    $('.screen').fadeOut(speed, a.doneScreen);
  };
  
  a.fbLogin = function(cb) {
      FB.login(function(response) {
        if (response.authResponse) {
          console.log('?uid=' + response.authResponse.userID);
          console.log('&token=' + response.authResponse.accessToken);
          a.screen('title');
          //cb('');
        } else {
          a.screen('login');
          //cb('Login failed.');
        }
      });
    };
    
  a.fbInit = function (fbAppId) {
    console.log(fbAppId);
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
        console.log('?uid=' + response.authResponse.userID);
        console.log('&token=' + response.authResponse.accessToken);
        a.screen('title');
      } else {
        a.screen('login');
      }
    });
  };
  
  fbAsyncInit();
 });