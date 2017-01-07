    var mongoose = require('mongoose')
    var Schema = mongoose.Schema;
    
    var CommentSchema = new Schema({
        body: { type: String, required: true },
        author: { type: String, required: true },
        upvotes: Number
      });

    var PictureSchema = new Schema({
      title: { type: String, required: true },
      link: { type: String, optional: true },
      author: { type: String, required: true },
      content:{type : String, optional: true},
      comments: [CommentSchema],
      upvotes: Number
    });

    module.exports = mongoose.model('pictures', PictureSchema);