// declare modules
var express = require('express');
var fs = require('fs');
var app = express();
var content;

app.use(express.logger());

//read index.html and modify buffer to string to send to client
fs.readFileSync('index.html',function(err,data){
	if (err) throw err;
	content = data;
});

app.get('/', function(request, response) {
  response.send(content.toString('utf-8'));
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
