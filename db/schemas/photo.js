const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);


const photoSchema = mongoose.Schema({
  p_id: {type: Number, unique: true},
  answer_id: {type: Number, index: true},
  url: String
});

photoSchema.plugin(AutoIncrement, {inc_field: 'p_id'});
photoSchema.index({answer_id: 1})

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo