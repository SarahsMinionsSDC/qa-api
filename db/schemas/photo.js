const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
  id: {type: Number, unique: true},
  answer_id: {type: Number, index: true},
  url: String
});

photoSchema.index({answer_id: 1})

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo