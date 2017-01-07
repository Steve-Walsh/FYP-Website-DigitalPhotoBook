    var mongoose = require('mongoose')
    var Schema = mongoose.Schema;
    
    var attendersSchema = new Schema({
        name: { type: String, required: true },
        email: { type: String, required: true },
        id: Number
      });

    var pictureSchema = new Schema({
      name : {type: String, required: true},
      location : {type: String, requried: true},
      uploadedBy : {type: String, required: true}

    })

    var EventSchema = new Schema({
      title: { type: String, required: true },
      eventLocation: { type: String, optional: true },
      startTime:{type: Date, required: true},
      endTime:{type: Date, required: true},
      admin: { type: String, required: true },
      attenders: [attendersSchema],
      pictures: [CommentSchema],
    });

    module.exports = mongoose.model('posts', PostSchema);