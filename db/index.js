const mongoose = require('mongoose');
const Question = require('./schemas/question.js');
const Answer = require('./schemas/answer.js');
const Photo = require('./schemas/photo.js');

mongoose.connect(`mongodb://localhost/questions-answers`, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('mongoose connected');
})

const helpers = {
  addQuestion: (req, callback) => {
    // req.body params: body, name, email, product_id
    let question_id = Math.floor(Math.random() * Math.floor(999999999999)) // random number between 0 and 1 trillion - good enough for now but should change this in the future

    let question = new Question({
      question_id,
      product_id: req.body.product_id,
      question_body: req.body.body,
      question_date: new Date(),
      asker_name: req.body.name,
      asker_email: req.body.email,
      reported: false,
      helpfulness: 0,
      answers: []
    })

    question.save((err, ques) => {
      callback(err, ques)
    })

  },
  getQuestionsByProductId: (req, callback) => {
    // params product_id, page (default 1), count (default 5)
    let product_id = req.params.product_id;
    let page = req.params.page || 1;
    let count = req.params.count || 5;
    let query = Question.find({ product_id, reported: 0 }); // only get non-reported questions

    query.limit(count)
    query.sort({ helpfulness: -1 }) // sort by most helpful

    query.exec((err, questions) => {
      callback(err, questions)
    })
  },
  getAnswersByQuestionId: (req, callback) => {
    // params product_id, page (default 1), count (default 5)
    let question_id = req.params.question_id;
    let page = req.params.page || 1;
    let count = req.params.count || 5;
    let query = Question.find({ question_id, reported: 0 }); // only get non-reported answers

    query.limit(count)
    query.sort({ helpfulness: -1 }) // sort by most helpful

    query.exec((err, answers) => {
      callback(err, answers)
    })

  },
  addAnswer: (req, callback) => {
    // req.params : question_id
    let question_id = Number(req.params.question_id);
    let answer_id = Math.floor(Math.random() * Math.floor(999999999999))

    let photos = [];

    // req.body params: body, name, email, photos

    // make an array of new Photo objects, with a random photo id, the current random answer_id, and each url from req.body.photos array
    if (req.body.photos.length) {
      for (let url of req.body.photos) {
        let id = Math.floor(Math.random() * Math.floor(999999999999));
        photos.push(new Photo({ id, answer_id, url }))
      }
    }

    let answer = new Answer({
      answer_id,
      question_id,
      body: req.body.body,
      date: new Date(),
      answerer_name: req.body.name,
      answerer_email: req.body.email,
      reported: false,
      helpfulness: 0,
      photos
    })

    // find by question_id and update into answers array
    let query = Question.find({ question_id });
    query.updateOne({ $push: { answers: answer } })
    query.exec((err, result) => {
      callback(err, result)
    })
  },
  helpfulQuestion: (req, callback) => {
    let question_id = req.params.question_id;
    let query = Question.find({ question_id });
    query.updateOne({ $inc: { "helpfulness": 1 } })
    query.exec((err, result) => {
      callback(err, result)
    })
  },
  reportQuestion: (req, callback) => {
    let question_id = req.params.question_id;
    let query = Question.find({ question_id });
    query.updateOne({ reported: 1 })
    query.exec((err, result) => {
      callback(err, result)
    })
  },
  helpfulAnswer: (req, callback) => {
    let answer_id = Number(req.params.answer_id);
    Question.findOneAndUpdate(
      { answers: { $elemMatch: { answer_id } } },
      { $inc: { "answers.$.helpfulness": 1 } }
    ).exec(callback)
  },
  reportAnswer: (req, callback) => {
    let answer_id = Number(req.params.answer_id);
    Question.findOneAndUpdate(
      { answers: { $elemMatch: { answer_id } } },
      { $set: { "answers.$.reported": 1 } }
    ).exec(callback)
  },
}

module.exports = { db, helpers };