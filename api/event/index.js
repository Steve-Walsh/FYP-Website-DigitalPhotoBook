var express = require('express');
var controller = require('./events.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/myEvents/:_id', controller.myEvents);
router.get('/event/:id', controller.show);
router.post('/', controller.create);
router.post('/joinEvent/:eventId', controller.joinEvent);
router.delete('/:id', controller.destroy);
router.get('/eventDetails/:_id', controller.show);
router.post('/releaseImgs', controller.releaseImgs);
router.post('/changePublicType', controller.changePublicType);
router.post('/removeUser', controller.removeUser);
router.post('/removePicture', controller.removePicture);




module.exports = router;