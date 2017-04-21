  var express = require('express');
  var controller = require('./users.controller');

  var router = express.Router();

  router.get('/', controller.index);
  router.post('/registerNewUser', controller.create);
  // router.put('/:id', controller.update);
  // router.delete('/:id', controller.destroy);
  router.post('/login', controller.login);



  module.exports = router;
