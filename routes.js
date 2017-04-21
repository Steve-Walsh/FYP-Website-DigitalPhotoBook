module.exports = function(app) {

  app.use('/api/users', require('./api/user/index'));
  app.use('/api/events', require('./api/event/index'));
  app.use('/api/pictures', require('./api/picture/index'));
  
  // All undefined asset or api routes should return a 404

  app.route('/:url(api|app|assets)/*')
   .get(function(req, res) {
    res.status(404).send("nope");
  })

};

