    var mongoose = require('mongoose')
    var Schema = mongoose.Schema;
    
    var attendersSchema = new Schema({
        name: { type: String, required: true },
        email: { type: String, required: true },
        id: { type: String, required: true }
      });

    var pictureSchema = new Schema({
      name : {type: String, required: true},
      location : {type: String, requried: true},
      onwer : {type: String, required: true},
      timeStamp: {type: Date, required: true}

    })

    var EventSchema = new Schema({
      title: { type: String, required: true },
      location: { type: String, optional: true },
      startTime:{type: String, optional: true},
      endTime:{type: String, optional: true},
      admin: { type: String, required: true },
      adminId:{type:String, required:true},
      info: { type: String, optional: true },
      attenders: [attendersSchema],
      pictures: [pictureSchema],
    });

    module.exports = mongoose.model('events', EventSchema);




