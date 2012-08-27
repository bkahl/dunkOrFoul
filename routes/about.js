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

exports.about = function(req, res, next){
  
  var proxy = new DribbbleProxy(),
      debut_shots = [],
      pages = [];
  
  var rowPage  = (req.query['page']*1 || 1),
      nextPage = parseInt(rowPage,10)+1,
      previousPage = rowPage <= 1 ? 1 : parseInt(rowPage,10)-1,
      prevEnabled, nextEnabled;

  if(rowPage === 1) prevEnabled = "disabled";
  else prevEnabled = "active";
  
  console.log("THE CURRENT PAGE = ", rowPage);
    
  proxy.get_shots_object_by_debuts(rowPage, function(error, shots) {
    if (error) return next(error);
    
    for(var i=0; i<shots.shots.length; i++){
      debut_shots.push(shots.shots[i]);
    }
    for(var p=2; p<shots.pages+1; p++){
      pages.push(p);
    }
    
    res.render('about', { title: 'National Design League', 
                          debut_shots: debut_shots, 
                          per_page: shots.per_page, 
                          pages: pages,
                          page: rowPage,
                          next: {
									page: nextPage
								}, 
                          prev: {
									isEnabled: prevEnabled,
									page: previousPage
								},
			            });
  });
  

  
};

