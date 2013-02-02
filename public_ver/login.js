$(function() {
  // TODO : Adding button click listener from javascript or jquery
  var $loginBtn = $('<button id="login-btn">Facebook Login</button>');
  $loginBtn.click(a.fbLogin);
  a.doneScreen($loginBtn);
});