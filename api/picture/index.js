var express = require('express');
var controller = require('./pictures.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/picture/:id', controller.show);
// router.post('/:id/upvotes', controller.update_upvotes);
// router.post('/:id/comments', controller.add_comment);
// router.post('/:picture_id/comments/:comment_id/upvotes', controller.update_comment_upvotes);
router.delete('/:id', controller.destroy);
router.post('/tagfaces', controller.tagfaces);
router.get('/tags/:id', controller.gettags);


module.exports = router;