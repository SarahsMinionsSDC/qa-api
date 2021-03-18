const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
  a_id: {type: Number, index: true},
  question_id: {type: Number, index: true},
  body: String,
  date_written: Date,
  answerer_name: String,
  answerer_email: String,
  reported: Number,
  helpful: Number,
  photos: Array
});

answerSchema.index({a_id: 1})
answerSchema.index({question_id: 1})

const Answer = mongoose.model("Answer", answerSchema);

module.exports = Answer