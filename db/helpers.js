const mongoose = require('mongoose');
const db = mongoose.connect(`mongodb://localhost/questions-answers`, { useNewUrlParser: true, useUnifiedTopology: true });
const Question = require('./schemas/question.js');
const Answer = require('./schemas/answer.js');
const Photo = require('./schemas/photo.js');



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
  addAnswer: (req, callback) => {
    // req.params : question_id
    let q_id = Number(req.params.question_id);
    let a_id = Math.floor(Math.random() * Math.floor(999999999999)) // random number between 0 and 1 trillion - good enough for now but should change this in the future

    // req.body params: body, name, email, photos
    let date = new Date();
    let answer = new Answer({
      a_id,
      q_id,
      body: req.body.body,
      date_written: date,
      answerer_name: req.body.name,
      answerer_email: req.body.email,
      reported: 0,
      helpful: 0,
      photos: []
    })

    // find by question_id and update into answers array
    let query = Question.find({ q_id });
    query.updateOne({ $push: { answers: answer } })
    query.exec((err, result) => {
      if (req.body.photos && req.body.photos.length) {
        helpers.addPhotosToAnswer(req.body.photos, a_id, callback)
      } else { callback(err, result) }
    })
  },
  addPhotosToAnswer: (photoUrls, targetAnswerId, callback) => {
    // look up target answer (matching by id just created)
    let query = Question.find({answers: { $elemMatch: { a_id: targetAnswerId } } });
    let photos = [];
    // make an array of new Photo objects, with a random photo id, the target answer_id, and each url from req.body.photos array
    for (let url of photoUrls) {
      let p_id = Math.floor(Math.random() * Math.floor(999999999999));
      photos.push(new Photo({ p_id, answer_id: targetAnswerId, url }))
    }
    // then set targets' array of photo objects to the one just created
    query.updateOne({ $set: { "answers.$.photos" : photos } })
    query.exec((err, result) => {
      callback(err, result)
    })
  },
  helpfulQuestion: (req, callback) => {
    let q_id = req.params.question_id;
    let query = Question.find({ q_id });
    query.updateOne({ $inc: { "helpful" : 1 } })
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
    let a_id = Number(req.params.answer_id);
    Question.findOneAndUpdate(
      { answers: { $elemMatch: { a_id } } },
      { $inc: { "answers.$.helpful" : 1 } }
    ).exec(callback)
  },
  reportAnswer: (req, callback) => {
    let a_id = Number(req.params.answer_id);
    Question.findOneAndUpdate(
      { answers: { $elemMatch: { a_id } } },
      { $set: { "answers.$.reported": 1 } }
    ).exec(callback)
  },
}

module.exports = { db, helpers };