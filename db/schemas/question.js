const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  question_id: {type: Number, index: true, unique: true},
  product_id: {type: Number, index: true},
  question_body: String,
  question_date: Date,
  asker_name: String,
  asker_email: String,
  reported: Boolean,
  helpfulness: Number,
  answers: Array
});


questionSchema.index({question_id: 1})
questionSchema.index({product_id: 1})

const Question = mongoose.model("Question", questionSchema);

module.exports = Question