	var express = require('express');
	var app = express(); 
	var port = 8080
	
	var mongoose = require('mongoose');    // NEW   
	mongoose.connect('mongodb://localhost/photoAppDB'); // NEW

	require('./config/express').addMiddleware(app)
	require('./routes')(app)

	// global.jQuery = require('jquery');
	// require('bootstrap');
	// require('./node_modules/bootstrap')

	app.listen(port, function() {
	  console.log('Express server listening on port : '+ port);
	});