  var Picture = require('./picture.model');  

    function handleError(res, err) {
      return res.send(500, err);
    }

    // Get list of pictures
    exports.index = function(req, res) {
        Picture.find(function (err, pictures) {
        if(err) { return handleError(res, err); }
        return res.json(200, pictures);
      });
    } ;

    
    exports.create = function(req, res) {
      var picture = {
      title : req.body.title,
      author : req.body.author,
      link : req.body.link,
      content : req.body.content,
      comments : [],
      upvotes : 0 
      };
     

      Picture.create(picture, function(err, picture) {
        if(err) { 
          return handleError(res, err); }
        return res.json(201, picture);
      });
    };

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


    exports.update_upvotes = function(req, res) {
      console.log(req.params.id)
      var num = req.body.upvotes 
      num = num + 1
      Picture.findOneAndUpdate(
        {_id: req.params.id }, 
        { upvotes: num },
        { safe: true, upsert: true },
        function (err) {
          if(err) { return handleError(res, err); 
            console.log('this is an error in upvotes')}
        return res.send(200, 'Update successful');

        });
    };

    exports.add_comment = function(req, res) {

    var comment = {
        author: req.body.author , 
        body: req.body.body
    };

    Picture.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { comments: comment }},
      { safe: true, upsert: true },
      function(err) {
        if(err) { return handleError(res, err); }
        return res.send(200, 'Update successful');
        });

    };

