/*
 * Module dependencies
 */
var express = require('express'),
    app = express(),
    util = require('util');

/*
 * Setup App
 */
app.set('views', __dirname + '/views')
app.set('view engine', 'jade');
app.locals.pretty = true;

// middleware
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'randomSecretShhh!'}));
app.use(express.static(__dirname + '/public_html'))

/*
 * Global Functions
 */
var logged_in = false;

function validateSession(req, res, next) {
    if (!req.session.user_id) {
        res.send('You are not authorized to view this page');
    } else {
        var logged_in = true;
        next();
    }
}

/*
 * Routes
 */

//------------------------------------------------------------------------------
// INDEX
//------------------------------------------------------------------------------
app.get('/', function (req, res) {
  res.render('index',
    { title : 'Home', user: { logged_in:logged_in } }
  )
});

//------------------------------------------------------------------------------
// LOGIN
//------------------------------------------------------------------------------
app.post('/login', function (req, res) {
    //res.send('<pre>' + util.inspect(req.body, false, null));
    var post = req.body;
    
    if (post.username == 'test' && post.password == 'test') {
        req.session.user_id = 1;
        res.redirect('/todos');
    } else {
        res.send('Bad user/pass');
    }
});

//------------------------------------------------------------------------------
// TODOS
//------------------------------------------------------------------------------
app.get('/todos', validateSession, function (req, res) {
    res.send('if you are viewing this page it means you are logged in');
});

/*
 * Init App
 */

app.listen(80)