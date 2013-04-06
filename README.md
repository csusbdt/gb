Grade Badge
=============

This is a sample Facebook App using Node.js and MongoDB

Overview 
-------------


Code Design Architecture
------------------------
* There will be one node js module to represent the mongoDB collection, named model_(collection_name).js
* Many-to-many relationships are represented by linking documents, named (a)_(b)_links
* All node js modules that start with req_*.js are request handler that get requested from router.js 
* All ajax requests will go through req_op.js, that verifies the user logged-in to Facebook and app_version is current. Every req_op.js request must contains Facebook access_token and app_version. If the user is not logged-in to Facebook, req_op.js returns the following JSON document, {login:true}, if the version is not current, then req_op.js return the following JSON document, {ver:true}
* There will be one node js module to handle ajax request from client, named op_(request).js
* talk req_mem.js
* talk req_counter.js


 



