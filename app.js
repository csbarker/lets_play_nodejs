/*
 * Module dependencies
 */
var express = require('express'),
    app = express();

/*
 * Start the App
 */
app.set('views', __dirname + '/views')
app.set('view engine', 'jade');
app.locals.pretty = true;
app.use(express.static(__dirname + '/public_html'))

/*
 * Settings
 */


/*
 * Views
 */
app.get('/', function (req, res) {
  res.render('index',
  { title : 'Home' }
  )
})

app.listen(8080)