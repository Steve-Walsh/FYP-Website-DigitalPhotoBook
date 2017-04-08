var express     = require('express');
var app         = express(); 
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport    = require('passport');
var config      = require('./config/database'); // get db config file
var User        = require('./api/user/user.model.js'); // get the mongoose model
var port        = process.env.PORT || 8080;
var jwt         = require('jwt-simple');
var mongoose    = require('mongoose'); 
var multer      = require('multer');
var http        = require('http');

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




var imageFileName
var eventId
var timeStamp

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    console.log(file)
    callback(null, './public/data/images');
  },
  filename: function (req, file, callback) {
    timeStamp = Date.now()
    eventId = file.originalname
    imageFileName = file.fieldname + '-' + timeStamp + ".jpeg"
    callback(null, imageFileName);

  }
});
var upload = multer({ storage : storage}).single('userPhoto');


app.post('/api/photo',function(req,res){



  upload(req,res,function(err) {
    if(err) {
      console.log(err)
      return res.end("Error uploading file.");
    }
    var Picture = require('./api/picture/picture.model');
    var Event = require('./api/event/event.model');
    console.log(imageFileName);


    var token = req.headers.token.substring(4)

    var decoded = jwt.decode(token, config.secret);
    console.log(decoded)
    console.log(eventId)


    var picture = {
      name: imageFileName,
      owner: decoded._id,
      pictureOnwer: decoded._id,
      location: "/data/images/"+imageFileName,
      event:  eventId,
      timeStamp: timeStamp
    }
    console.log(picture)

    Event.findOneAndUpdate( 
      { _id: eventId },
      { $push: { pictures: picture }},
      { safe: true, upsert: true },
      function(err) {
        if(err) { return handleError(res, err); }
        return;
      });

    Picture.create(picture, function(err, Picture) {
      if(err) { 
        console.log(err)
        return handleError(res, err); }
        return;
      });



    
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
var server = require('http').createServer(app);

var io = require('socket.io')(server);


// io.on('connection', function(){ 
//   /* … */ 
// });
// server.listen(3000);




io.on('connection', function(socket){
  console.log('A user connected');

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });

});

server.listen(port, function() {
    console.log('Express server listening on port : '+ port);
  });

// io.on('connection', function (socket) {
//   var addedUser = false;
//   console.log("new user")

//   // when the client emits 'new message', this listens and executes
//   socket.on('new message', function (data) {
//     console.log("new mess")
//     // we tell the client to execute 'new message'
//     socket.broadcast.emit('new message', {
//       username: socket.username,
//       message: data
//     });
//   });

//   // when the client emits 'add user', this listens and executes
//   socket.on('add user', function (username) {
//     if (addedUser) return;

//     // we store the username in the socket session for this client
//     socket.username = username;
//     socket.room = room
//     addedUser = true;
//     socket.emit('login', {
//       numUsers: numUsers
//     });
//     // echo globally (all clients) that a person has connected
//     // socket.broadcast.emit('user joined', {
//     //   username: socket.username,
//     //   numUsers: numUsers
//     // });
//   });

//   // when the client emits 'typing', we broadcast it to others
//   // socket.on('typing', function () {
//   //   socket.broadcast.emit('typing', {
//   //     username: socket.username
//   //   });
//   // });

//   // // when the client emits 'stop typing', we broadcast it to others
//   // socket.on('stop typing', function () {
//   //   socket.broadcast.emit('stop typing', {
//   //     username: socket.username
//   //   });
//   // });

//   // when the user disconnects.. perform this
//   // socket.on('disconnect', function () {
//   //   if (addedUser) {
//   //     // echo globally that this client has left
//   //     socket.broadcast.emit('user left', {
//   //       username: socket.username,
//   //       numUsers: numUsers
//   //     });
//   //   }
//   // });
// });


  