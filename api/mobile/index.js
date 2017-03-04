var express = require('express');
var controller = require('./mobile.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/login', controller.login);
router.get('/events', controller.events);


// router.get('/picture/:id', controller.show);
// router.post('/', controller.create);
// router.post('/:id/upvotes', controller.update_upvotes);
// router.post('/:id/comments', controller.add_comment);
// router.post('/:picture_id/comments/:comment_id/upvotes', controller.update_comment_upvotes);
// router.delete('/:id', controller.destroy);


module.exports = router;