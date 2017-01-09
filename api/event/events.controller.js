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
      var Event = {
      title : req.body.title,
      admin : req.body.admin,
      info : req.body.info,
      admin : req.body.admin,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      attenders : [],
      pictures : []
      };

      Event.create(Event, function(err, Event) {
        if(err) { return handleError(res, err); }
        return res.json(201, Event);
      });
    };

    exports.show = function(req, res) {
          Event.find({_id : req.params.id}, function(err, Event){
             if(err) { return handleError(res, err); }
             console.log(Event)
             return res.json(Event);
          })
    
        };
    exports.myEvents = function(req, res){
      var myEventsList = []
              Event.find(function (err, Events) {
        if(err) { return handleError(res, err); }

        Events.forEach(function(event){

          event.attenders.forEach(function(person){

          console.log('person : ', person);

          if(person.id == req.params._id){

            console.log("event is " , event)

            myEventsList.push(event)
          }})

          if(event.adminId == req.params._id){
            console.log("admin id" , event.adminID)
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

    exports.update_comment_upvotes = function(req, res) {
       // TODO
      } 