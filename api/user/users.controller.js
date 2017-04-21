  var User = require('./user.model');
  var jwt = require('jwt-simple');
  var config = require('./../../config/database');
  //var jwt = require()


  function handleError(res, err) {
      return res.status(500).send(err);
  }

  // Get list of user
  exports.index = function(req, res) {
      User.find(function(err, users) {
          if (err) {
              return handleError(res, err);
          }
          return res.status(200).json(users);
      });
  };

  // Creates a new user in datastore.
  exports.create = function(req, res) {
      if (!req.body.email || !req.body.password) {
          return res.status(500).json({ success: false, msg: 'Please pass name and password.' });
      } else {
          var newUser = new User({
              name: req.body.name,
              password: req.body.password,
              email: req.body.email
          });
          // save the user
          newUser.save(function(err) {
              if (err) {
                  return handleError(res, err);
              }
              return res.status(200).json({ success: true, msg: 'Successful created new user.' });
          });
      }
  };


  exports.login = function(req, res) {

      User.findOne({
          email: req.body.email
      }, function(err, user) {
          if (err){
            return handleError(res, err);
          }

          if (!user) {
              res.send({ success: false, msg: 'Authentication failed. User not found.' });
          } else {
              // check if password matches
              user.comparePassword(req.body.password, function(err, isMatch) {
                  if (isMatch && !err) {
                      // if user is found and password is right create a token
                      var token = jwt.encode(user, config.secret);
                      // return the information including token as JSON
                      console.log("TOKEN" ,token)
                      if (typeof token == undefined) {
                          res.send({ success: false, msg: 'Authentication failed. Wrong password.' });
                      } else {
                          res.json({ success: true, token: 'JWT ' + token });
                      }
                  } else {
                      res.send({ success: false, msg: 'Authentication failed. Wrong password.' });
                  }
              });
          }
      })


  };



  // // Deletes a user from datastore.
  // exports.destroy = function(req, res) {
  //     console.log(req.params.id)
  //     User.remove({ _id: req.params.id }, function(err) {
  //         if (err) {
  //             return handleError(res, err);
  //         }
  //     })
  // };
