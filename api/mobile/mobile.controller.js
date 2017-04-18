  var Picture = require('./../picture/picture.model');
  var Event = require('./../event/event.model');
  var User = require('./../user/user.model');


  function handleError(res, err) {
      return res.send(500, err);
  }

  // Get list of pictures
  exports.index = function(req, res) {
      Event.find().populate('pictures').lean().exec(function(err, events) {
          if (err) {
              return handleError(res, err); }
          console.log("hello shane" + events)
          return res.json(200, events);
      });
  };

  exports.login = function(req, res) {
      console.log("inside")

      User.find(function(err, users) {
          users.forEach(function(user) {
              if (user.email == req.body.email) {
                  console.log("email is right " + user.email + "  -  " + req.body.email)
                  if (user.password == req.body.password) {
                      console.log("user has logged in " + user.email)
                      return res.json(200, user);
                  } else {
                      return res.json(err)
                  }
              }
          })

      })

  };

  exports.events = function(req, res) {
      Event.find().populate('pictures').lean().exec(function(err, events) {
          if (err) {
              return handleError(res, err); }
          return res.json(200, events);
      });
  };


  exports.pictures = function(req, res) {
      Picture.find(function(err, pictures) {
          if (err) {
              return handleError(res, err); }
          return res.json(200, pictures);
      });
  };


  //     exports.addPicture = function(req, res) {
  //       var responce = "responce from website"

  //       console.log(req);
  //       return res.json(200, responce);
  //       // console.log("On home page")
  //       // console.log(req.body.encoded_string)
  //       // console.log(req.body.name)
  //       // console.log(req.body.image)
  //       // res.send('Image uploaded')
  //       // var date = Date.now();
  //       // var name = date + "_"+ req.body.image
  //       // var fs = require("fs");

  //       // fs.writeFile("./pictures/" +name, new Buffer(req.body.encoded_string, "base64"), function(err) {});

  // };
