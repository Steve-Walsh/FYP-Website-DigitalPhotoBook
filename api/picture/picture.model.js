    var mongoose = require('mongoose')
    var Schema = mongoose.Schema;


    var PictureSchema = new Schema({
      name: { type: String, required: true },
      location: { type: String, optional: true },
      owner: { type: String, required: true },
      event: {type: String, required:true}

    });

    module.exports = mongoose.model('pictures', PictureSchema);