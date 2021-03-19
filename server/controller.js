const {helpers} = require ('../db/helpers.js');

const controller = {
  addQuestion: (req, res) => {
    // req.body params: body, name, email, product_id
    // status 201
    // res.send('add question')
    helpers.addQuestion(req, (err) => {
      err ? console.error(err) : res.status(201).send();
    })
  },
  getQuestionsByProductId: (req, res) => {
    helpers.getQuestionsByProductId(req, (err, result) => {
      err ? console.error(err) : res.status(200).json(result)
    })
  },
  getAnswersByQuestionId: (req, res) => {
    helpers.getAnswersByQuestionId(req, (err, result) => {
      err ? console.error(err) : res.status(200).json(result)
    })
  },
  addAnswer: (req, res) => {
    // params question_id
    // req.body params: body, name, email, photos
    // status 201
    res.send('add answer')
  },
  helpfulQuestion: (req, res) => {
    helpers.helpfulQuestion(req, (err) => {
      err ? console.error(err) : res.status(204).send()
    })
  },
  reportQuestion: (req, res) => {
    helpers.reportQuestion(req, (err) => {
      err ? console.error(err) : res.status(204).send()
    })
  },
  helpfulAnswer: (req, res) => {
    helpers.helpfulAnswer(req, (err) => {
      err ? console.error(err) : res.status(204).send()
    })
  },
  reportAnswer: (req, res) => {
    // params question_id
    // status 204
    res.send('reported answer')
  }
}

module.exports = controller;