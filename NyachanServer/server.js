var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require("fs");

var app = express();

// Connection URL 
var url = 'mongodb://alisson:123456@ds053206.mlab.com:53206/nyachan_data';

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
  next();
});

app.use(bodyParser.json());

require('./RestAPI.js')(app, express, path);
require('./databaseManager.js')(app);

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {})