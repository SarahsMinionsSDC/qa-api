const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
  p_id: Number,
  answer_id: {type: Number, index: true},
  url: String
});

photoSchema.index({answer_id: 1})

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo