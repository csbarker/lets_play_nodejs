var express = require('express'),
    app = express();

app.use(express.static(__dirname + '/public_html'));

app.listen(8080);