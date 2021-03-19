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
    // query.sort({helpfulness: 1 or -1})

    query.exec((err, questions) => {
      callback(err, questions)
    })

  },

  // getAnswersByQuestionId,
  // addAnswer,
  // helpfulQuestion,
  // reportQuestion,
  // helpfulAnswer,
  // reportAnswer,
}

module.exports = helpers;