  var Picture = require('./picture.model');  

  function handleError(res, err) {
    return res.send(500, err);
  }

    // Get list of pictures
    exports.index = function(req, res) {
      var pictures = []
      Picture.find(function (err, pics) {
        if(err) { return handleError(res, err); }
        pics.forEach(function(pics){
          if(pics.ownerId == req.body.id){
            pictures.push(pics)
          }

        })

        return res.json(200, pictures);
      });
    } ;

    
    exports.create = function(req, res) {
      console.log(req)

     // console.log("user Id is : ",req.body.userId)
     // console.log("Image name is : ",req.body.imageName)
     // console.log("timeStamp is : ",req.body.timeStamp)
     // console.log("Email is : ", req.body.userEmail)
     // console.log("event  is : ", req.body.eventId)
     // // var date = Date.now();
     // var name = req.body.imageName
     // var fileLoc = "./../frontEndWebsite/website/public/data/" +name;
     // var imageLoc = "/data/" + name;
     // var fs = require("fs");

     // fs.writeFile(fileLoc, new Buffer(req.body.encoded_string, "base64"), function(err) {});

     res.send('hello')

    //  MongoClient.connect('mongodb://localhost/photoAppDB', function(err, db) {
    //   if(err) throw err;
    //   var collectionEvent = db.collection('events');
    //   var collectionPicutre = db.collection('pictures');
    //   var o_id = new ObjectID(req.body.eventId);

    //   collectionEvent.update({"_id": o_id}, 
    //    {$push: { 
    //     "pictures":{ "name":req.body.imageName,"location":imageLoc, "timeStamp":  req.body.timeStamp, "uploadedBy": req.body.userId}}
    //   })

    //   collectionPicutre.insert({"name": req.body.imageName, "location": imageLoc, "owner": req.body.user, "ownerId" : req.body.userId, "timeStamp": req.body.timeStamp})
    // })
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


