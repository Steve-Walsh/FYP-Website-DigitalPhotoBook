    var mongoose = require('mongoose')
    var Schema = mongoose.Schema;
    mongoose.Promise = global.Promise;

    var attendersSchema = new Schema({
        name: { type: String, required: true },
        email: { type: String, required: true },
        id: { type: String, required: true },
        numOfPics: { type: Number, required: true }
    });

    var EventSchema = new Schema({
        title: { type: String, required: true },
        location: { type: String, optional: true },
        startTime: { type: String, optional: true },
        endTime: { type: String, optional: true },
        admin: { type: String, required: true },
        adminId: { type: String, required: true },
        info: { type: String, optional: true },
        attenders: [attendersSchema],
        pictures: [{ type: mongoose.Schema.Types.ObjectId, ref: "pictures", required: true }],
        iconPicked: { type: String, required: true },
        released: { type: Boolean, required: true },
        publicEvent: { type: Boolean, required: true }
    });

    module.exports = mongoose.model('events', EventSchema);
