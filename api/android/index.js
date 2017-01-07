var express = require('express')
var controller = require('./android.controller');

var router = express.Router();

router.post('/postImage', controller.create);

module.exports = router;


// app.listen(8080, function(){
// 	console.log("listening on port 8080");
// })