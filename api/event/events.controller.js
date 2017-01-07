  var Post = require('./events.model');  

    function handleError(res, err) {
      return res.send(500, err);
    }

    // Get list of posts
    exports.index = function(req, res) {
        Post.find(function (err, posts) {
        if(err) { return handleError(res, err); }
        return res.json(200, posts);
      });
    } ;

    // Creates a new post in datastore.
    exports.create = function(req, res) {
      var post = {
      title : req.body.title,
      admin : req.body.admin,
      link : req.body.link,
      admin : req.body.admin,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      attenders : [],
      pictures : []
      };

      Post.create(post, function(err, post) {
        if(err) { return handleError(res, err); }
        return res.json(201, post);
      });
    };

    exports.show = function(req, res) {
          Post.find({_id : req.params.id}, function(err, post){
             if(err) { return handleError(res, err); }
             console.log(post)
             return res.json(post);
          })
    
        };
    

  exports.destroy = function(req, res) {
    console.log(req.params.id)
    Post.remove({_id: req.params.id}, function(err){
        if(err){
           return handleError(res, err);
        }
      })};


    exports.update_upvotes = function(req, res) {
      console.log(req.params.id)
      var num = req.body.upvotes 
      num = num + 1
      Post.findOneAndUpdate(
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

    Post.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { comments: comment }},
      { safe: true, upsert: true },
      function(err) {
        if(err) { return handleError(res, err); }
        return res.send(200, 'Update successful');
        });

    };

    exports.update_comment_upvotes = function(req, res) {
       // TODO
      } 