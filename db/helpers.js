const axios = require('axios');
const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/questions-answers`, { useNewUrlParser: true, useUnifiedTopology: true });
const Question = require('./schemas/question.js');

// endpoint localhost:27017/questions-answers

// sample
// getQuestionsByProductId = (id, callback) => {
//   const options = {
//     method: 'get',
//     url: 'localhost:27017/questions-answers',
//     headers: {
//       'User-Agent': 'request'
//     }
//   }

//   axios(options)
//     .then((response) => {
//       callback(null, response.data)
//     })
//     .catch((err) => {
//       callback(err)
//     })
// }

const helpers = {
  // addQuestion,
  getQuestionsByProductId: (req, callback) => {
    // params product_id, page (default 1), count (default 5)
    let product_id = req.params.product_id;
    let page = req.params.page || 1;
    let count = req.params.count || 5;
    let query = Question.find( {product_id });

    query.limit(5) // for testing, not sure this should be page, count or page * count yet
    // query.sort(should ignore things with reported: 1, or possibly put that logic inside the .find query)
    // query.sort({helpfulness: 1 or -1})

    query.exec((err, questions) => {
      callback(err, questions)
    })
  },
  getAnswersByQuestionId: (req, callback) => {
    // params product_id, page (default 1), count (default 5)
    let q_id = req.params.question_id;
    let page = req.params.page || 1;
    let count = req.params.count || 5;
    let query = Question.find( {q_id });

    query.limit(5) // for testing, not sure this should be page, count or page * count yet
    // query.sort(should ignore things with reported: 1, or possibly put that logic inside the .find query)
    // query.sort({helpfulness: 1 or -1})

    query.exec((err, answers) => {
      callback(err, answers)
    })
  },
  // addAnswer,
  helpfulQuestion: (req, callback) => {
    let q_id = req.params.question_id;
    let query = Question.find( {q_id });
    query.updateOne({ $inc: {"helpful" : 1} })
    query.exec((err, result) => {
      callback(err, result)
    })
  },
  reportQuestion: (req, callback) => {
    let q_id = req.params.question_id;
    let query = Question.find( {q_id });
    query.updateOne({ reported : 1})
    query.exec((err, result) => {
      callback(err, result)
    })
  },
  // helpfulAnswer,
  // reportAnswer,
}

module.exports = helpers;