const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  q_id: {type: Number, index: true},
  product_id: {type: Number, index: true},
  body: String,
  date_written: Date,
  asker_name: String,
  asker_email: String,
  reported: Number,
  helpful: Number,
  answers: Array
});

questionSchema.index({q_id: 1})
questionSchema.index({product_id: 1})

const Question = mongoose.model("Question", questionSchema);

module.exports = Question