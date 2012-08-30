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
	
	var proxy = new DribbbleProxy();
	
	app.get('/', function(req, res, next){
	  
	  var debut_shots = [],
	      pages = [];

	  var rowPage  = (req.query['page']*1 || 1),
	      nextPage = parseInt(rowPage,10)+1,
	      previousPage = rowPage <= 1 ? 1 : parseInt(rowPage,10)-1,
	      prevEnabled, nextEnabled;

	  if(rowPage === 1) { prevEnabled = "disabled"; }
	  else { prevEnabled = "active"; }

	  console.log("THE CURRENT PAGE = ", rowPage);
	
	  proxy.get_shots_object_by_debuts(rowPage, function(error, shots) {
		var i, p;
		
	    if (error) { return next(error); }

	    for(i=0; i<shots.shots.length; i++){
	      debut_shots.push(shots.shots[i]);
	    }
	    for(p=2; p<shots.pages+1; p++){
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
	
	app.post('/search', function(req, res, next){

		 // shots_count:
		 // 	     twitter_screen_name:
		 // 	     avatar_url:
		 // 	     likes_received_count:
		 // 	     name:
		 // 	     created_at:
		 // 	     location:
		 // 	     following_count:
		 // 	     likes_count:
		 // 	     website_url:
		 // 	     username:
		 // 	     url:
		 // 	     rebounds_count:
		 // 	     draftees_count:
		 // 	     id:
		 // 	     drafted_by_player_id:
		 // 	     followers_count:
		 // 	     comments_received_count:
		 // 	     comments_count:
		 // 	     rebounds_received_count:
	
		var postUserName = req.body.username,
			player_shots = [],
		    pages = [];
		
		console.log('username: ',req.body.username);
		
		// proxy to search for usernames on dribbbles api
		proxy.get_object_by_username(postUserName, function( error, userData) {
            
			if(error) { return next(error); }
			
			for(i=0; i<userData.shots.length; i++){
				player_shots.push(userData.shots[i]);
			}
			
			var player_info = {};
			var ps = player_shots[0].player;
			
			for (i in ps){
				//checks to see if player_shots array has this 'i' property before pushing/creating the
				//player_info array
				if (ps.hasOwnProperty(i)) {
					var dynamic_var_name = i;
					// creates dynamic object by storing everything on a namespace
					player_info[dynamic_var_name] = ps[i];
				}	
			}
			//console.log(player_info);
			console.log(player_shots);
			
			res.render('search', { 	searchTitle: 'NDL - ' + player_info.name,
									title: 'National Design League', 
		                          	player_info: player_info,
								  	player_shots: player_shots
			});
		
		});
	});
	
	app.get('/about', function(req, res, next){
		res.render('about', { title: 'National Design League' });
	});
	
	app.get('/contact', function(req, res, next){
		res.render('contact', { title: 'National Design League' });
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

