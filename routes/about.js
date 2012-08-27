/*globals exports */
/*
 * GET home page.
 */

var mongoose          = require('mongoose'),
    config            = require('../config'),
    connection_string = config.connection_string,
    db                = mongoose.connect(connection_string),
    User              = require('../models/user'),
    DribbbleProxy     = require('../dribbble-proxy'),
    user;

// user = new User({
//   'username' : 'edgar'
// });
// 
// user.save(function(err) {
//   console.log('error: ' + err);
//   User.find(function(err, arr) {
//       console.log(arr);
//       console.log('length='+arr.length);
//       process.exit();
//   });
// });



