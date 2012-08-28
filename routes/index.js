/*globals exports */

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

module.exports = function(app) {
	
	app.get('/', function(req, res, next){
		
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

	    res.render('index', { title: 'National Design League', 
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
									}
				            });
	  });
	
	});
	
	app.get('/about', function(req, res, next){
		res.render('about', { title: 'National Design League' });
	});
	
	// proxy.get_shots_object_by_how_many_debuts(14, function(error, shots){
	//   if (error) return next(error);
	//   //console.log(shots);
	//   var shotsString = shots.map(function(shot) {
	//     return JSON.stringify(shot);
	//   });
	//   res.render('index', { title: 'National Design League', shots: shots, shotsString: shotsString });
	// });
	// 
	// proxy.paginate( "shots/debuts", function( error, paginate ) {
	//   if (error) return next(error);
	//   console.log(paginate);
	//   
	//   res.render('index', { paginate: paginate });
	// });
	// 
	// var search = req.query['username'];
	// 
	// proxy.get_object_by_username('simplebits', function(error, shots) {
	//   if (error) return next(error);
	//   // var shotsString = shots.map(function(shot) {
	//   //   return JSON.stringify(shot);
	//   // });
	//   res.render('index', { username: search,
	//                         title: 'National Design League', 
	//                         shots: shots });
	// });
};

