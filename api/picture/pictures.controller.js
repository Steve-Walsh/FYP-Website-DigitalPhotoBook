  var Picture = require('./picture.model');
  var multer      = require('multer'); 

  function handleError(res, err) {
    return res.send(500, err);
  }

    // Get list of pictures
    exports.index = function(req, res) {
      var pictures = []
      Picture.find(function (err, pics) {
        if(err) { return handleError(res, err); }
        pics.forEach(function(pics){
            pictures.push(pics)

        })

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

var fileName

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    console.log(file)
    callback(null, './public/data/images');
  },
  filename: function (req, file, callback) {
    var time = Date.now()
    callback(null, file.fieldname + '-' + time + ".jpg");
    fileName = file.fieldname + '-' + time + ".jpg"
  }
});

var upload = multer({ storage : storage}).single('userPhoto');


exports.create = function(req, res){
  console.log(req.options)
  var fileLoc = "./public/data/" +name;


  upload(req,res,function(err) {
    if(err) {
      console.log(err)
      return res.end("Error uploading file.");
    }
    var Picture = require('./api/picture/picture.model');
    var Event = require('./api/event/event.model');
    var User = require('./api/user/user.model');
    console.log(fileName);

    res.end("File is uploaded");
  });
};