const {helpers} = require ('../db/helpers.js');

const controller = {
  addQuestion: (req, res) => {
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
    helpers.addAnswer(req, (err) => {
      err ? console.error(err) : res.status(201).send();
    })
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
    helpers.reportAnswer(req, (err) => {
      err ? console.error(err) : res.status(204).send()
    })
  }
}

module.exports = controller;