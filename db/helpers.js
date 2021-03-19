const mongoose = require('mongoose');
const db = mongoose.connect(`mongodb://localhost/questions-answers`, { useNewUrlParser: true, useUnifiedTopology: true });
const Question = require('./schemas/question.js');

// endpoint localhost:27017/questions-answers

const helpers = {
  addQuestion: (req, callback) => {
    // req.body params: body, name, email, product_id
    let question = new Question({
      product_id: req.body.product_id,
      body: req.body.body,
      date_written: new Date(),
      asker_name: req.body.name,
      asker_email: req.body.email,
      reported: 0,
      helpful: 0,
      answers: []
    })

    question.save((err, success) => {
      callback(err, question)
    })

  },
  getQuestionsByProductId: (req, callback) => {
    // params product_id, page (default 1), count (default 5)
    let product_id = req.params.product_id;
    let page = req.params.page || 1;
    let count = req.params.count || 5;
    let query = Question.find({ product_id, reported: 0 }); // only get non-reported questions

    query.limit(count)
    query.sort({ helpful: -1 }) // sort by most helpful

    query.exec((err, questions) => {
      callback(err, questions)
    })
  },
  getAnswersByQuestionId: (req, callback) => {
    // params product_id, page (default 1), count (default 5)
    let q_id = req.params.question_id;
    let page = req.params.page || 1;
    let count = req.params.count || 5;
    let query = Question.find({ q_id, reported: 0 }); // only get non-reported questions

    query.limit(count)
    query.sort({ helpful: -1 }) // sort by most helpful

    query.exec((err, answers) => {
      callback(err, answers)
    })
  },
  // addAnswer,
  helpfulQuestion: (req, callback) => {
    let q_id = req.params.question_id;
    let query = Question.find({ q_id });
    query.updateOne({ $inc: { "helpful": 1 } })
    query.exec((err, result) => {
      callback(err, result)
    })
  },
  reportQuestion: (req, callback) => {
    let q_id = req.params.question_id;
    let query = Question.find({ q_id });
    query.updateOne({ reported: 1 })
    query.exec((err, result) => {
      callback(err, result)
    })
  },
  helpfulAnswer: (req, callback) => {
    let a_id = req.params.answer_id;
    let query = Question.find({ answers: { $elemMatch: { a_id } } });

    // not working
    query.updateOne({ $inc: { "answers.$.helpful": 1 } });

    query.exec((err, result) => {
      callback(err, result)
    })
  },
  reportAnswer: (req, callback) => {
    let a_id = req.params.answer_id;
    let query = Question.find({ answers: { $elemMatch: { a_id } } });

    // not working
    query.updateOne({ "answers.$.reported": 1 })
    query.exec((err, result) => {
      callback(err, result)
    })
  },
}

module.exports = {db, helpers};