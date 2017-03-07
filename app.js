var express 	= require('express');
var app			= express(); 
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport	= require('passport');
var config      = require('./config/database'); // get db config file
var User        = require('./api/user/user.model.js'); // get the mongoose model
var port        = process.env.PORT || 8080;
var jwt         = require('jwt-simple');
var mongoose 	= require('mongoose'); 

//mongoose.connect('mongodb://localhost/photoAppDB'); 


// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
// log to console
app.use(morgan('dev'));
 
// Use the passport package in our application
app.use(passport.initialize())

require('./config/express').addMiddleware(app)
require('./routes')(app)


app.listen(port, function() {
  console.log('Express server listening on port : '+ port);
});