var express 	= require('express');
var app			= express(); 
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport	= require('passport');
var config      = require('./config/database'); // get db config file
var User        = require('./api/user/user.model.js'); // get the mongoose model
var port        = process.env.PORT || 8080;
var jwt         = require('jwt-simple');
var mongoose 	= require('mongoose'); 
var multer      = require('multer');

mongoose.connect(config.database); 

// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// log to console
app.use(morgan('dev'));
 
// Use the passport package in our application
app.use(passport.initialize())

require('./config/express').addMiddleware(app)
require('./config/passport')(passport);




var fileName

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    console.log(file)
    callback(null, './public/data/images');
  },
  filename: function (req, file, callback) {
    var dateNow = Date.now()
    fileName = file.fieldname + '-' + Date.now() + ".jpg"
    callback(null, fileName);

  }
});
var upload = multer({ storage : storage}).single('userPhoto');


app.post('/api/photo',function(req,res){
  console.log(req.options)
  var fileLoc = "./public/data/" +name;


  upload(req,res,function(err) {
    if(err) {
      console.log(err)
      return res.end("Error uploading file.");
    }
    var Picture = require('./api/picture/picture.model');
    var Event = require('./api/event/event.model');
    var User = require('./api/user/user.model');
    console.log(fileName);

    res.end("File is uploaded");
  });
});








app.post('/authenticate', function (req, res) {
    console.log("inside")
  console.log(req.body);
  
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      console.log("not user")
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          console.log(token);
          res.json({success: true, token: 'JWT ' + token});
        } else {
          console.log("false")
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
})
});
require('./routes')(app)

app.listen(port, function() {
  console.log('Express server listening on port : '+ port);
});
