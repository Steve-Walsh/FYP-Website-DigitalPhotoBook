  var express = require('express');
  var controller = require('./users.controller');

  var router = express.Router();

  router.get('/', controller.index);
  router.post('/registerNewUser', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.destroy);
  router.post('/login', controller.login);



  module.exports = router;

  function handleError(res, err) {
      return res.send(500, err);
    }

    // Get list of users
    exports.index = function(req, res) {
      User.find(function (err, users) {
        if(err) { return handleError(res, err); }
        return res.json(200, users);
      });
    } ;

    // Creates a new user in datastore.
    exports.create = function(req, res) {
      User.create(req.body, function(err, contact) {
        if(err) { return handleError(res, err); }
        return res.json(201, contact);
      });
    };

