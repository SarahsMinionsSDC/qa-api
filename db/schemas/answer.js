const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);


const answerSchema = mongoose.Schema({
  a_id: {type: Number, index: true, unique: true},
  question_id: {type: Number, index: true},
  body: String,
  date_written: Date,
  answerer_name: String,
  answerer_email: String,
  reported: Number,
  helpful: Number,
  photos: Array
});

answerSchema.plugin(AutoIncrement, {inc_field: 'a_id'});

answerSchema.index({a_id: 1})
answerSchema.index({question_id: 1})

const Answer = mongoose.model("Answer", answerSchema);

module.exports = Answer