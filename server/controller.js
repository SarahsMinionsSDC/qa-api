const helpers = require ('../db/helpers.js');

const controller = {
  addQuestion: (req, res) => {
    // req.body params: body, name, email, product_id
    // status 201
    res.send('add question')
  },
  getQuestionsByProductId: (req, res) => {
    helpers.getQuestionsByProductId(req, (err, result) => {
      err ? console.error(err) : res.status(200).json(result)
    })
  },
  getAnswersByQuestionId: (req, res) => {
    // params product_id, page (default 1), count (default 5),
    // status 200
    res.send('answers by question id')
  },
  addAnswer: (req, res) => {
    // params question_id
    // req.body params: body, name, email, photos
    // status 201
    res.send('add answer')
  },
  helpfulQuestion: (req, res) => {
    // params question_id
    // status 204
    res.send('helpful question')
  },
  reportQuestion: (req, res) => {
    // params question_id
    // status 204
    res.send('reported question')
  },
  helpfulAnswer: (req, res) => {
    // params question_id
    // status 204
    res.send('helpful answer')
  },
  reportAnswer: (req, res) => {
    // params question_id
    // status 204
    res.send('reported answer')
  }
}

module.exports = controller;