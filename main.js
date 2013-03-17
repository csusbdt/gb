var http                  = require('http');
var router                = require('./router');
var model                 = require('./model');
var group                 = require('./model_group');
var fb                    = require('./fb');

// TODO: minify js and css as part of deployment process.
// IDEA: minify at startup rather than as a build step.

// TODO: Check concepts against the following article.
// https://devcenter.heroku.com/articles/increasing-application-performance-with-http-cache-headers

// Check for required environmental variables.
if (process.env.PORT       === undefined) throw new Error('PORT not defined');
if (process.env.MONGO_PORT === undefined) throw new Error('MONGO_PORT not defined');
if (process.env.MONGO_HOST === undefined) throw new Error('MONGO_HOST not defined');
if (process.env.MONGO_DB   === undefined) throw new Error('MONGO_DB not defined');
if (process.env.FB_APP_ID  === undefined) throw new Error('FB_APP_ID not defined');
if (process.env.FB_SECRET  === undefined) throw new Error('FB_SECRET not defined');
if (process.env.APP_VER    === undefined) throw new Error('APP_VER not defined');


// Trim for foreman.
process.env.PORT       = process.env.PORT       .replace(' ', '');
process.env.MONGO_PORT = process.env.MONGO_PORT .replace(' ', '');
process.env.MONGO_HOST = process.env.MONGO_HOST .replace(' ', '');
process.env.MONGO_DB   = process.env.MONGO_DB   .replace(' ', '');
process.env.FB_APP_ID  = process.env.FB_APP_ID  .replace(' ', '');
process.env.FB_SECRET  = process.env.FB_SECRET  .replace(' ', '');
process.env.APP_VER    = process.env.APP_VER    .replace(' ', '');

var n = 3;
function done() {
  if (--n === 0) {
    router.start();
  }  
}
model  .init(done);
router .init(done);
fb     .init(done);
