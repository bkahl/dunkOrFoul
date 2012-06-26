//Pull Dribbble Data from their API

var request = require('request'),
    api = "http://api.dribbble.com";

var DribbbleProxy = function() {};
  
DribbbleProxy.prototype.get_shots_object_by_how_many_debuts = function( howManyPerPage, callback ) {
  this.dribbbleGetRequest("/shots/debuts/per_page=" + howManyPerPage, function(err, debutsFeed){
    if (err) return callback("Couldn't Find Feed, Check to See if Dribble Is Down!"); 
    var debuts = [];
    for(var i=0; i<howManyPerPage; i++){
      debuts.push(debutsFeed.shots[i]);
    }
    console.log(debuts);
    callback(null, debuts);
  });
};

DribbbleProxy.prototype.get_shots_object_by_debuts = function(page, callback ) {
  this.dribbbleGetRequest("/shots/debuts/?page="+page, function(err, debutsFeed){
    if (err) return callback("Couldn't Find Feed, Check to See if Dribble Is Down!"); 
    callback(null, debutsFeed);
  });
};

DribbbleProxy.prototype.get_object_by_username = function(username, callback ) {
  this.dribbbleGetRequest("/"+username, function(err, usernameFound){
    if (err) return callback("Could Not Find Username!"); 
    callback(null, usernameFound);
  });
};

//DribbbleProxy.prototype.paginate = function(collection, q, sort, pageNumber, resultsPerPage, cb) 
DribbbleProxy.prototype.paginate = function(whatToPaginate, callback) {
  this.dribbbleGetRequest("/"+whatToPaginate+"/", function(err, debutsFeed){
    if (err) return callback("Nothing To Paginate!");
    callback(null, debutsFeed.page);
    //var skipFrom = (debutsFeed.page * debutsFeed.per_page) - debutsFeed.per_page;
    //var cursor   = collection.find(q).skip(skipFrom).limit(resultsPerPage);
    
  });
    // var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;
    // var cursor   = collection.find(q).skip(skipFrom).limit(resultsPerPage);
    // if (sort) cursor.sort(sort);
    // cursor.toArray(function (err, data) {
    //   if (err) return cb(err);
    //   collection.count(q, function (err, cnt) {
    //     if (err) return cb(err);
    //     cb(null, {
    //       queryObject: q,
    //       query: JSON.stringify(q),
    //       page: parseInt(pageNumber,10),
    //       pages: Math.floor(cnt / resultsPerPage),
    //       hasPrevious: parseInt(pageNumber,10)-1 > 0,
    //       hasNext: parseInt(pageNumber,10)+1 <= Math.floor(cnt / resultsPerPage),
    //       next: parseInt(pageNumber,10)+1,
    //       previous: parseInt(pageNumber,10)-1,
    //       records: data});
    //   });
    // });
};

DribbbleProxy.prototype.get_players_object_by_id = function( playerId, callback ) {
  this.dribbbleGetRequest("/players/" + playerId, function(err, playerData){
    if (err) return callback("players/:id - " + playerId + ", Doesn't Exist!");   
    callback(null, playerData);
  });
};

DribbbleProxy.prototype.get_players_object_by_username = function( userName, callback ) {
  this.dribbbleGetRequest("/players/" + userName, function(err, playerData){
    if (err) return callback("players/:username - " + userName + ", Doesn't Exist!");   
    callback(null, playerData);
  });
};

// #################################################################################
// Primitive API Calls
// #################################################################################

/**
  This is the helper method that actually makes the GET to the dribbble backend

  @param {String} url - this is the relative url to the specific dribbble endpoint
  @param {Function} callback - Callback function
*/
    
DribbbleProxy.prototype.dribbbleGetRequest = function(url, callback){
  var URL = api + url;
  console.log(URL);
  this._requestJSON(URL, callback);
};

// #################################################################################
// @private HELPERS
// #################################################################################

DribbbleProxy.prototype._requestJSON =  function(url, callback) {
  request(url, function (error, response, body) {
    if (error) return callback(error); 
    
    // good to go
    if (response.statusCode !== 200) callback(response.statusCode + " - " + body);
    var json = JSON.parse(body);
    callback(null, json);
  });
};

module.exports = DribbbleProxy;

// var d = new DribbbleProxy().get_shots_object_by_how_many_debuts(2, function( error, callback ){
//   if (error) console.log(error);
//   
//   callback.forEach(function(feed){
//     //console.log(feed);
//     for(var key in feed){
//       if ( feed.hasOwnProperty(key) ){
//         console.log(key + " -> " + feed[key]);
//       }
//     }
//     console.log('\n');
//     console.log('**********************************************');
//     console.log('\n');
//   });
// });



















