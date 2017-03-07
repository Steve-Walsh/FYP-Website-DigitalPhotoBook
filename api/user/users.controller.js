var User = require('./user.model');


  function handleError(res, err) {
      return res.send(500, err);
    }

  // Get list of user
  exports.index = function(req, res) {
        User.find(function (err, users) {
        if(err) { return handleError(res, err); }
        return res.json(200, users);
      });
    } ;

  // Creates a new user in datastore.
  exports.create = function(req, res) {

  if (!req.body.name || !req.body.password) {
    res.json({success: false, msg: 'Please pass name and password.'});
  } else {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email
    });
    // save the user
    User.create(newUser, function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
  //   User.create(user, function(err, user){
  //     if(err) {
  //       return handleError(res, err);
  //     }

  //   return res.json(201, user);
  // })
};

// exports.login = function.(req, res){
//   User.find(function (err, users){
//     users.forEach(function(user){
//       if(user.email == userDetails.email){
//         console.log("email is right " + user.email + "  -  " + userDetails.email)
//         if(user.password == userDetails.password){
//           console.log("user has logged in " + user.email)
//           return.res.json(200, user);
//               }
//       }
//     })

//   })

// };
 // Update an existing user in datastore.
  exports.update = function(req, res) {
       User.findById(req.params.id, function (err, user) {
            user.name = req.body.name
            user.address = req.body.address
            user.phone_number = req.body.phone_number
            user.save(function (err) {
                if(err) { return handleError(res, err); }
                return res.send(200, 'Update successful');
            });
        });
     }

  // Deletes a user from datastore.
  exports.destroy = function(req, res) {
    console.log(req.params.id)
    User.remove({_id: req.params.id}, function(err){
        if(err){
           return handleError(res, err);
        }
      })};