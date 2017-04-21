var express = require('express');
var controller = require('./pictures.controller');

var router = express.Router();

router.get('/', controller.getMyPictures);
router.get('/picture/:id', controller.getPicture);
// router.delete('/:id', controller.destroy);
router.post('/tagfaces', controller.tagfaces);
router.get('/tags/:id', controller.getTags);


module.exports = router;