  var Picture = require('./../picture/picture.model');  
  var Event = require('./../event/event.model');
  var User = require('./../user.model');


    function handleError(res, err) {
      return res.send(500, err);
    }

    // Get list of pictures
    exports.index = function(req, res) {
        Event.find(function (err, events) {
        if(err) { return handleError(res, err); }
        console.log("hello shane" + events)
        return res.json(200, events);
      });
    } ;

exports.login = function.(req, res){
  User.find(function (err, users){
    users.forEach(function(user){
      if(user.email == userDetails.email){
        console.log("email is right " + user.email + "  -  " + userDetails.email)
        if(user.password == userDetails.password){
          console.log("user has logged in " + user.email)
          return.res.json(200, user);
              }
      }
    })

  })

};

    
//     exports.create = function(req, res) {
//       console.log("On home page")
//       console.log(req.body.encoded_string)
//       console.log(req.body.name)
//       console.log(req.body.image)
//       res.send('Image uploaded')
//       var date = Date.now();
//       var name = date + "_"+ req.body.image
//       var fs = require("fs");

//       fs.writeFile("./pictures/" +name, new Buffer(req.body.encoded_string, "base64"), function(err) {});

// };


   