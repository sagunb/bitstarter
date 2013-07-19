// declare modules
var express = require('express');
var fs = require('fs');
var app = express();

app.use(express.logger());

//read index.html and store to buffer
var content = fs.readFileSync('index.html');

app.get('/', function(request, response) {
  response.send(content.toString('utf8'));
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
