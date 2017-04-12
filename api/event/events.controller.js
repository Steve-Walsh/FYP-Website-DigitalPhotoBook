var Event = require('./event.model');  
var jwt         = require('jwt-simple');
var config      = require('./../../config/database');

function handleError(res, err) {
  return res.send(500, err);
}

// Get list of Events
exports.index = function(req, res) {
  var token = req.headers.authorization.substring(11)

  var decoded = jwt.decode(token, config.secret);

  Event.find(function (err, Events) {
    var allEvents = []
    Events.forEach(function(event){
     if(event.publicEvent){
      allEvents.push(event)
    }else{
      event.attenders.forEach(function(curEvent){
        console.log(curEvent)
        curEvent.attenders.forEach(function(person){
          if(person.id == decoded.id){
            allEvents.push(event)
          }})
      })
      if(event.adminId == decoded._id){
        allEvents.push(event)
      }
    }
  })

    if(err) { return handleError(res, err); }
    return res.json(200, allEvents);
  });
} ;

    // Creates a new Event in datastore.
    exports.create = function(req, res) {
      var token = req.headers.authorization.substring(11)
      var decoded = jwt.decode(token, config.secret);

      console.log(req.body)
      var event = {
        title : req.body.title,
        admin : req.body.admin,
        info : req.body.info,
        adminId : req.body.adminId,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        location: req.body.location,
        iconPicked: req.body.iconPicked,
        attenders : [],
        pictures : [],
        released: req.body.released,
        publicEvent: req.body.publicEvent
      };


      Event.create(event, function(err, Event) {
        if(err) { 
          console.log(err)
          return handleError(res, err); }
          return res.json(201, Event);
        });
    };

// exports.show = function(req, res) {
//       Event.find({_id : req.params.id}, function(err, Event){
//          if(err) { return handleError(res, err); }
//          return res.json(Event);
//       })

//     };


exports.myEvents = function(req, res){

  var token = req.headers.authorization.substring(11)

  var decoded = jwt.decode(token, config.secret);

  var myEventsList = []

  Event.find(function (err, Events) {
    if(err) { return handleError(res, err); }

    Events.forEach(function(event){

      event.attenders.forEach(function(person){
        if(person.id == req.params._id){
          myEventsList.push(event)
        }})
      if(event.adminId == req.params._id){
        myEventsList.push(event)
      }
    })
    return res.json(200, myEventsList);
  });

};

exports.destroy = function(req, res) {
  console.log(req.params.id)
  Event.remove({_id: req.params.id}, function(err){
    if(err){
      return handleError(res, err);
    }
  })};



  exports.joinEvent = function(req, res) {
    var token = req.headers.authorization.substring(11)

    var decoded = jwt.decode(token, config.secret);

    var newAttender = {
      id: req.body._id,
      name: req.body.name, 
      email: req.body.email,
      numOfPics : 0
    };

    Event.findOneAndUpdate( 
      { _id: req.params.eventId },
      { $push: { attenders: newAttender }},
      { safe: true, upsert: true },
      function(err) {
        if(err) { return handleError(res, err); }
        return res.send(200, 'Update successful');
      });

  };

  exports.show = function(req, res) {
    console.log(req.params._id)
    Event.findOne({
      _id : req.params._id
    }, function (err, data) {
      if (err) throw err;
      if(!data){
        res.send({success : false, msg : "no event by that id"})
      }else{
        res.json({success: true, event : data})
      }
    })
  } 



  exports.releaseImgs = function(req, res) {
    var token = req.headers.authorization.substring(11)

    var decoded = jwt.decode(token, config.secret);
    console.log(req.body._id)

    Event.findOneAndUpdate( 
      { _id: req.body._id },
      { released : true},
      function(err) {
        if(err) { return handleError(res, err); }
        return res.send(200, 'Update successful');
      });

  };

  exports.changePublicType = function(req, res) {
    var token = req.headers.authorization.substring(11)
    var decoded = jwt.decode(token, config.secret);
    Event.findOneAndUpdate( 
      { _id: req.body._id },
      { publicEvent : req.body.publicEvent},
      function(err) {
        if(err) { return handleError(res, err); }
        return res.send(200, 'Update successful');
      });
  };

  exports.removeUser = function(req, res) {
    var token = req.headers.authorization.substring(11)
    var decoded = jwt.decode(token, config.secret);
    console.log(req.body)
    Event.update( 
      { _id: req.body.eventId },
      {$pull: {"attenders": {id : req.body.id}}},
      function(err) {
        if(err) { return handleError(res, err); }
        return res.send(200, 'Update successful');
      });
  };

