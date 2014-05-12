var express = require('express');
var app = express();

// Index
app.get('/', function(req, res){
  res.send('Hello World');
});

// Error Handling
app.use(function(req, res, next){
  res.status(404);
  res.send('<h2>404 Not Found</h2>');
});

app.listen(3000);
console.log('Listening on port 3000');