var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var morgan = require('morgan');

exports.addMiddleware = function(app) {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(express.static('public'));
  app.use(errorHandler()); // Error handler - has to be last
}