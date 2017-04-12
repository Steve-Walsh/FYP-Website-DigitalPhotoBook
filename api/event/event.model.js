    var mongoose = require('mongoose')
    var Schema = mongoose.Schema;
    
    var attendersSchema = new Schema({
      name: { type: String, required: true },
      email: { type: String, required: true },
      id: { type: String, required: true },
      numOfPics: {type: Number, required: true}
    });

    var taggedSchema = new Schema({
      name: { type: String, required: true },
    });

    var pictureSchema = new Schema({
      name : {type: String, required: true},
      location : {type: String, requried: true},
      owenrUName : {type: String, required: true},
      owner : {type: String, required: true},
      timeStamp: {type: Date, required: true},
      tagged: [taggedSchema]
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
      iconPicked: {type: String, required: true},
      released: {type: Boolean, required: true},
      publicEvent: {type: Boolean, required: true}
    });

    module.exports = mongoose.model('events', EventSchema);




