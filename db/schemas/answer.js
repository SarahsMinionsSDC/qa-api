const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
  answer_id: {type: Number, index: true, unique: true},
  question_id: {type: Number, index: true},
  body: String,
  date: String,
  answerer_name: String,
  answerer_email: String,
  reported: Boolean,
  helpfulness: Number,
  photos: Array
});

answerSchema.index({answer_id: 1})
answerSchema.index({question_id: 1})

const Answer = mongoose.model("Answer", answerSchema);

module.exports = Answer