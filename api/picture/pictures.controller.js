  var Picture = require('./picture.model');
  var jwt = require('jwt-simple');
  var config      = require('./../../config/database')

  function handleError(res, err) {
    return res.send(500, err);
  }

    // Get list of pictures
    exports.index = function(req, res) {

      var token = req.headers.authorization.substring(11) //.token.substring(4)
      var decoded = jwt.decode(token, config.secret);
      var pictures = []
      Picture.find({owner: decoded._id}, function (err, pics) {
        if(err) { return handleError(res, err); }
        // pics.forEach(function(pics){
        //   // if(pics.owner == )
        //   pictures.push(pics)

        // })

        return res.json(200, pics);
      });
    } ;

    



    exports.show = function(req, res) {
      Picture.find({_id : req.params.id}, function(err, picture){
       if(err) { return handleError(res, err); }
       console.log(picture)
       return res.json(picture);
     })

    };


    exports.destroy = function(req, res) {
      console.log(req.params.id)
      Picture.remove({_id: req.params.id}, function(err){
        if(err){
         return handleError(res, err);
       }
     })};

