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
    //var $script = $('<script></script>'); 
    //$script.attr('src', screenName + '.js');
    //$('body').append($script);
    //$.getScript(screenName + '.js');
    
    var ref = document.getElementsByTagName('script')[0],
        screenJs = document.createElement('script');
    screenJs.async = true;
    screenJs.src = screenName + '.js';
    ref.parentNode.insertBefore(screenJs, ref);
      
    $('.screen').fadeOut(speed, a.doneScreen);
  };
  
  fbAsyncInit();
 });