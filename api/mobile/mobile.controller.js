  var Picture = require('./../picture/picture.model');  
  var Event = require('./../event/event.model');

    function handleError(res, err) {
      return res.send(500, err);
    }

    // Get list of pictures
    exports.index = function(req, res) {
        Event.find(function (err, events) {
        if(err) { return handleError(res, err); }
        console.log(events)
        return res.json(200, events);
      });
    } ;

    
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


   