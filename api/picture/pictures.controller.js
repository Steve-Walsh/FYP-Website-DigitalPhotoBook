  var Picture = require('./picture.model');
  var jwt = require('jwt-simple');
  var config = require('./../../config/database')

  function handleError(res, err) {
      return res.status(500).json(err);
  }

  // Get list of pictures
  exports.getMyPictures = function(req, res) {

      var token = req.headers.authorization.substring(11)
      var decoded = jwt.decode(token, config.secret);
      Picture.find({ owner: decoded._id }, function(err, pics) {
          if (err) {
              return handleError(res, err);
          }
          return res.status(200).json(pics);
      });
  };

  exports.getPicture = function(req, res) {
      var token = req.headers.authorization.substring(11)
      var decoded = jwt.decode(token, config.secret)
      Picture.find({ _id: req.params.id }, function(err, picture) {
          if (err) {
              return handleError(res, err);
          } else if (picture.length < 1) {
              return handleError(res, "no picture found");
          } else {

              return res.json(picture);
          }
      })

  };

  exports.destroy = function(req, res) {
      Picture.remove({ _id: req.params.id }, function(err) {
          if (err) {
              return handleError(res, err);
          }
      })
  };

  exports.tagfaces = function(req, res) {

      var token = req.headers.authorization.substring(11);
      var decoded = jwt.decode(token, config.secret);
      if (req.body.names == null) {

          return handleError(res, "names is empty");

      } else {


          Picture.findOneAndUpdate({ _id: req.body.picId }, { $set: { tagged: [] } }, { safe: true, upsert: true }, function(err, responce) {
              if (err) {
                  return handleError(res, err);
              } else {
                  Picture.findOneAndUpdate({ _id: req.body.picId }, { $pushAll: { tagged: req.body.names } }, { safe: true, upsert: true }, function(err, responce) {
                      if (err) {
                          return handleError(res, err);
                      } else {

                          return res.status(200).json({ success: true, msg: 'Update successful' });
                      }

                  })
              }
          })
      }

  }

  exports.getTags = function(req, res) {
      var token = req.headers.authorization.substring(11);
      var decoded = jwt.decode(token, config.secret);
      Picture.findOne({ _id: req.params.id }, function(err, pic) {
          if (err) {
              return handleError(res, err);
          } else if (pic == null) {
              return handleError(res, "no picture found");
          } else {
              if (pic.tagged.length < 1) {
                  pic.tagged = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
              }
              return res.status(200).json(pic)
          }
      })
  }
