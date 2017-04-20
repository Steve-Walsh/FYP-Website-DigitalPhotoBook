var Event = require('./event.model');
var jwt = require('jwt-simple');
var config = require('./../../config/database');
var Picture = require('./../picture/picture.model');

function handleError(res, err) {
    return res.status(500).json(err);
}

// Get list of Events
exports.index = function(req, res) {
    var token = req.headers.authorization.substring(11)

    var decoded = jwt.decode(token, config.secret);

    Event.find().populate('pictures').lean().exec(function(err, Events) {
        var allEvents = []
        Events.forEach(function(event) {
            if (event.publicEvent) {
                allEvents.push(event)
            } else {
                event.attenders.forEach(function(curEvent) {
                    curEvent.attenders.forEach(function(person) {
                        if (person.id == decoded.id) {
                            allEvents.push(event)
                        }
                    })
                })
                if (event.adminId == decoded._id) {
                    allEvents.push(event)
                }
            }
        })

        if (err) {
            return handleError(res, err);
        }
        return res.status(200).json(allEvents);
    });
};

// Creates a new Event in datastore.
exports.create = function(req, res) {
    var token = req.headers.authorization.substring(11)
    var decoded = jwt.decode(token, config.secret);

    var event = {
        title: req.body.title,
        admin: decoded.name,
        info: req.body.info,
        adminId: decoded._id,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        location: req.body.location,
        iconPicked: req.body.iconPicked,
        attenders: [],
        pictures: [],
        released: req.body.released,
        publicEvent: req.body.publicEvent
    };


    Event.create(event, function(err, Event) {
        if (err) {
            return handleError(res, err);
        }
        return res.status(201).json(Event);
    });
};

// exports.show = function(req, res) {
//       Event.find({_id : req.params.id}, function(err, Event){
//          if(err) { return handleError(res, err); }
//          return res.json(Event);
//       })

//     };


exports.myEvents = function(req, res) {

    var token = req.headers.authorization.substring(11)

    var decoded = jwt.decode(token, config.secret);

    var myEventsList = []

    Event.find().populate('pictures').lean().exec(function(err, Events) {
        if (err) {
            return handleError(res, err);
        }

        Events.forEach(function(event) {

            event.attenders.forEach(function(person) {
                if (person.id == decoded._id) {
                    myEventsList.push(event)
                }
            })
            if (event.adminId == decoded._id) {
                myEventsList.push(event)
            }
        })
        return res.status(200).json(myEventsList);
    });

};

exports.destroy = function(req, res) {
    Event.remove({ _id: req.params.id }, function(err) {
        if (err) {
            return handleError(res, err);
        }
    })
};



exports.joinEvent = function(req, res) {
    var token = req.headers.authorization.substring(11)

    var decoded = jwt.decode(token, config.secret);

    var newAttender = {
        id: decoded._id,
        name: decoded.name,
        email: decoded.email,
        numOfPics: 0
    };

    Event.findOneAndUpdate({ _id: req.params.eventId }, { $push: { attenders: newAttender } }, { safe: true, upsert: true },
        function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(200).json({ responce: 'Update successful' });
        });

};

exports.show = function(req, res) {
    // console.log(req.params._id)
    Event.findOne({
        _id: req.params._id
    }).populate('pictures').lean().exec(function(err, data) {
        if (err) throw err;
        if (!data) {
            res.status(500).send({ success: false, msg: "no event by that id" })
        } else {
            res.status(200).json({ success: true, event: data })
        }
    })
}



exports.releaseImgs = function(req, res) {
    var token = req.headers.authorization.substring(11)
    var decoded = jwt.decode(token, config.secret);

    Event.findOneAndUpdate({ _id: req.body._id }, { released: true },
        function(err, event) {
            if (err) {
                return handleError(res, err);
            }
            if (!event) {
                return res.status(500).json({ success: false, msg: 'no event' });
            }
            return res.status(200).json({ success: true, msg: 'Update successful' });
        });

};

exports.changePublicType = function(req, res) {
    var token = req.headers.authorization.substring(11)
    var decoded = jwt.decode(token, config.secret);
    Event.findOneAndUpdate({ _id: req.body._id }, { publicEvent: req.body.publicEvent },
        function(err, event) {
            if (err) {
                return handleError(res, err);
            }
            if (!event) {
                return res.status(500).json({ success: false, msg: 'no event' });
            }

            return res.status(200).json({ success: true, msg: 'Update successful' });
        });
};

exports.removeUser = function(req, res) {
    var token = req.headers.authorization.substring(11)
    var decoded = jwt.decode(token, config.secret);
    console.log(req.body)
    Event.update({ _id: req.body.eventId }, { $pull: { "attenders": { id: req.body.id } } },
        function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(200).json({ success: true, msg: 'Update successful' });
        });
};

exports.removePicture = function(req, res) {
    var token = req.headers.authorization.substring(11)
    var decoded = jwt.decode(token, config.secret);
    console.log(req.body)
    Event.update({ _id: req.body.eventId }, { $pull: { "pictures": { id: req.body.id } } },
        function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(200).json({ success: true, msg: 'Update successful' });
        });
};
exports.getPicEvent = function(req, res) {
    var token = req.headers.authorization.substring(11)
    var decoded = jwt.decode(token, config.secret);
    console.log(req.params.id)
    Event.find({ pictures: { $elemMatch: { "_id": "58edfa6f3fb58c3d83e30c50" } } },
        function(err, data) {
            console.log(data)
            if (err) {
                return handleError(res, err);
            }
            return res.status(200).json(data);
        });
    // Event.update( 
    //   { _id: req.body.eventId },
    //   {$pull: {"pictures": {id : req.body.id}}},
    //   function(err) {
    //     if(err) { return handleError(res, err); }
    //     return res.send(200, 'Update successful');
    //   });
};
