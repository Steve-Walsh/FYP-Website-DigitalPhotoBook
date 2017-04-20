  var Picture = require('./picture.model');
  var jwt = require('jwt-simple');
  var config = require('./../../config/database')

  function handleError(res, err) {
    console.log(err)
    return res.status(500).sent(err);
  }

  // Get list of pictures
  exports.index = function(req, res) {

      var token = req.headers.authorization.substring(11) //.token.substring(4)
      var decoded = jwt.decode(token, config.secret);
      var pictures = []
      Picture.find({ owner: decoded._id }, function(err, pics) {
        if (err) {
          return handleError(res, err);
        }
          // pics.forEach(function(pics){
          //   // if(pics.owner == )
          //   pictures.push(pics)

          // })

          return res.status(200).json(pics);
        });
    };





    exports.show = function(req, res) {
      Picture.find({ _id: req.params.id }, function(err, picture) {
        if (err) {
          return handleError(res, err);
        }
        console.log(picture)
        return res.json(picture);
      })

    };


    exports.destroy = function(req, res) {
      console.log(req.params.id)
      Picture.remove({ _id: req.params.id }, function(err) {
        if (err) {
          return handleError(res, err);
        }
      })
    };



    exports.tagfaces = function(req, res) {

      var token = req.headers.authorization.substring(11);
      var decoded = jwt.decode(token, config.secret);

      console.log("REQ : ", req.body)
      Picture.findOneAndUpdate({ _id: req.body.picId }, { $pushAll: { tagged: req.body.names } }, { safe: true, upsert: true }, function(err, responce) {
        if (err) {
          console.log(err)
        }
        console.log(responce)
      })

    }


    exports.gettags = function(req, res) {

      console.log("REQ : ", req.params)
      Picture.findOne({ _id: req.params.id }, function(err, pic) {
        if (err) {
          return handleError(res, err);
        }
        console.log(pic.tagged)
        if(pic.tagged.length <1){
          console.log("yes")
         pic.tagged = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
        }
        return res.status(200).json(pic)
      })
      }
