  var Picture = require('./../picture/picture.model');  
  var Event = require('./../event/event.model');
  var User = require('./../user/user.model');


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

exports.login = function(req, res){
  console.log("inside")
  console.log(req.body);
  
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
})


};

exports.events = function(req, res) {
        Event.find(function (err, events) {
        if(err) { return handleError(res, err); }
        return res.json(200, events);
      });
    } ;


    exports.pictures = function(req, res) {
        Picture.find(function (err, pictures) {
        if(err) { return handleError(res, err); }
        return res.json(200, pictures);
      });
    } ;
    
    
    exports.create = function(req, res) {
      console.log("On home page")
      console.log(req.body.encoded_string)
      console.log(req.body.name)
      console.log(req.body.image)
      res.send('Image uploaded')
      var date = Date.now();
      var name = date + "_"+ req.body.image
      var fs = require("fs");

      fs.writeFile("./pictures/" +name, new Buffer(req.body.encoded_string, "base64"), function(err) {});

};


   