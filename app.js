
/**
 * Module dependencies.
 */

var express         	= require('express'),
    routes          	= require('./routes'),
    // middleware      	= require('./middleware/user'),
    app 				= module.exports = express.createServer(),
    port 				= process.env.PORT || 4000;

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

// Now less files with @import 'whatever.less' will work(https://github.com/senchalabs/connect/pull/174)
var TWITTER_BOOTSTRAP_PATH = './vendor/twitter/bootstrap/less';
express.compiler.compilers.less.compile = function(str, fn){
  try {
    var less = require('less');var parser = new less.Parser({paths: [TWITTER_BOOTSTRAP_PATH]});
    parser.parse(str, function(err, root){fn(err, root.toCSS());});
  } catch (err) {fn(err);}
}

// Routes

// app.get('/', routes.index);
// app.get('/about', routes.about);

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
