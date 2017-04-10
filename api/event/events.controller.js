  var Event = require('./event.model');  

  function handleError(res, err) {
    return res.send(500, err);
  }

    // Get list of Events
    exports.index = function(req, res) {
      Event.find(function (err, Events) {
        if(err) { return handleError(res, err); }
        return res.json(200, Events);
      });
    } ;

    // Creates a new Event in datastore.
    exports.create = function(req, res) {
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
        pictures : []
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

        var newAttender = {
          id: req.body._id,
          name: req.body.name, 
          email: req.body.email
        };
        console.log("event is :", req.params.eventId);
        console.log("new person added to event is :", newAttender);


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


