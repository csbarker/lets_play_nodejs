/*
 * Module dependencies
 */
var express = require('express'),
    app = express(),
    mysql = require('mysql'),
    pool  = mysql.createPool({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'nodejs'
    });
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
app.use(express.static(__dirname + '/public'))

/*
 * Global Functions
 */
var logged_in = false;

function validateSession(req, res, next) {
    if (!req.session.user_id) {
        res.redirect('/');
    } else {
        var logged_in = true;
        next();
    }
}

function renderPage(res, page, data) {
    res.render(page, data);
}

/*
 * Routes
 */

//------------------------------------------------------------------------------
// INDEX
//------------------------------------------------------------------------------
app.get('/', function (req, res) {
  res.render('index', { 
      title : 'Home', 
      user: { logged_in:logged_in } 
  })
});

//------------------------------------------------------------------------------
// LOGIN / LOGOUT
//------------------------------------------------------------------------------
app.post('/login', function (req, res) {
    var post = req.body;
    
    if (post.username == 'test' && post.password == 'test') {
        req.session.user_id = 1;
        req.session.user_name = 'Callum Barker';
        
        res.redirect('/todos');
    } else {
        res.send('Bad user/pass');
    }
});

app.get('/logout', validateSession, function (req, res) {
    req.session.user_id = null;
    req.session.user_name = null;
    res.redirect('/');
});

//------------------------------------------------------------------------------
// TODOS
//------------------------------------------------------------------------------
app.get('/todos', validateSession, function (req, res) {
    var user_id = req.session.user_id;
    var data = { 
        title : 'Todos', 
        user: req.session,
        todos: ''
    };
    
    // Connections can be pooled to ease sharing a single connection, or managing multiple connections.
    // https://github.com/felixge/node-mysql
    pool.getConnection(function(err, connection) {
        connection.query( 'SELECT * FROM todos WHERE user_id = '+user_id, function(err, rows) {
            if (rows.length > 0) {
                console.log('Rows: ' + rows);
                data.todos = rows;
                renderPage(res, 'todos', data);
                connection.destroy()
            } else {
                console.log('Error: ' + err)
                renderPage(res, 'todos', data);
                connection.destroy()
            }
        })
    })

});

app.get('/todos/new', validateSession, function (req, res) {
    res.render('todos_create', { 
        title : 'Add Todo', 
        user: req.session
    })
});

app.post('/todos/new', validateSession, function (req, res) {
    var post = req.body;
    var insert = {
        user_id:    req.session.user_id,
        todo_name:  post.todo.name,
        todo_desc:  post.todo.desc,
        todo_added: new Date()
    }

    // form validation / sanity checks
    if (post.todo.name.length > 255 || post.todo.name.length <= 0 || post.todo.name.length > 10000) {
        res.redirect('/todos/new');
    }

    pool.getConnection(function(err, connection) {
        connection.query('INSERT INTO todos SET ?', insert, function(err, result) {
            if (err) throw err;
        })
    })

    res.redirect('/todos');

});

/*
 * Init App
 */

app.listen(80)