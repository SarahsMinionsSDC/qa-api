const {helpers} = require ('../db/index.js');

const controller = {
  addQuestion: (req, res) => {
    helpers.addQuestion(req, (err) => {
      err ? console.error(err) : res.status(201).send('CREATED');
    })
  },
  getQuestionsByProductId: (req, res) => {
    helpers.getQuestionsByProductId(req, (err, results) => {
      if(err) console.error(err);
      let formatted = {
        product_id: req.params.product_id,
        page: req.params.page || 1,
        count: req.params.count || 5,
        results: results[0].answers || []
      }
      res.status(200).json(formatted)
    })
  },
  getAnswersByQuestionId: (req, res) => {
    helpers.getAnswersByQuestionId(req, (err, results) => {
      if(err) console.error(err);
      let formatted = {
        question: req.params.question_id,
        page: req.params.page || 1,
        count: req.params.count || 5,
        results: results[0].answers || []
      }
      res.status(200).json(formatted)
    })
  },
  addAnswer: (req, res) => {
    helpers.addAnswer(req, (err) => {
      err ? console.error(err) : res.status(201).send('CREATED');
    })
  },
  helpfulQuestion: (req, res) => {
    helpers.helpfulQuestion(req, (err) => {
      err ? console.error(err) : res.status(204).send('NO CONTENT')
    })
  },
  reportQuestion: (req, res) => {
    helpers.reportQuestion(req, (err) => {
      err ? console.error(err) : res.status(204).send('NO CONTENT')
    })
  },
  helpfulAnswer: (req, res) => {
    helpers.helpfulAnswer(req, (err) => {
      err ? console.error(err) : res.status(204).send('NO CONTENT')
    })
  },
  reportAnswer: (req, res) => {
    helpers.reportAnswer(req, (err) => {
      err ? console.error(err) : res.status(204).send('NO CONTENT')
    })
  }
}

module.exports = controller;