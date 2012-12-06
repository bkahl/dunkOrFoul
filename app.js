/**
 * Module dependencies.
 */

var express         					= require('express'),
    routes          					= require('./routes'),
	fs 									= require('fs'),
	less 								= require('less'),
	http 								= require('http'),
	TWITTER_BOOTSTRAP_PATH 				= './vendor/twitter/bootstrap/less',
	masterCSS							= './public/stylesheets/style.css',
    // middleware      					= require('./middleware/user'),
    app 								= module.exports = express.createServer(),
    //port 								= process.env.PORT || 4000;
  	port								= process.env.VMC_APP_PORT || 1337;


// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.compiler({ src : __dirname + '/public', enable: ['less']}));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Compatible

/*****************************************************************************/
/* LESS COMPILATION
/*****************************************************************************/
// Remove style.css file if it exists in ./public/stylesheets/* otherwise it 
// won't recompile the less files.
if (app.settings.env === 'development') {
	fs.unlink(masterCSS, function (err) {
	  if (err) console.log(masterCSS, " doesn't exist!");
	  else console.log('successfully deleted ./public/stylesheets/style.css');
	});
}
// Less compiler, reads all the less files in ./vender/twitter/bootstrap/less and
// outputs the master style.css file in ./public/stylesheets/*.
express.compiler.compilers.less.compile = function(str, fn){
  try {
    var parser = new less.Parser({paths: [TWITTER_BOOTSTRAP_PATH]});
    parser.parse(str, function(err, root){fn(err, root.toCSS());});
	console.log("LESS SUCCESSFULLY GENERATED A MASTER CSS FILE!");
  } catch (err) {fn(err);}
}
/*****************************************************************************/

// Routes
routes(app);

// app.get('/', function(req, res) {
//   var fields = { subject: 1, body: 1, tags: 1, created: 1, author: 1 };
//   db.post.find({ state: 'published'}, fields, function(err, posts) {
//     console.log(posts);
//     if (!err && posts) {
//       res.render('index', { title: 'Blog list', postList: posts });
//     }
//     else console.log('nothing');
//   });
// });

app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

// http.createServer(app).listen(port), function(){
//   console.log("Express server listening on port %d in %s mode " + port);
// });
