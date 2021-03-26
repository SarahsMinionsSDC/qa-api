const router = require('express').Router();
const controller = require('./controller.js');

// /qa/

router
  .route('/questions')
    .post(controller.addQuestion) // add a question, which will have a product_id property
router
  .route('/questions/:product_id')
    .get(controller.getQuestionsByProductId) // retrieve a list of questions
router
  .route('/questions/:question_id/answers')
    .get(controller.getAnswersByQuestionId) // retrieves a list of answers
    .post(controller.addAnswer) // post new answer to a question id
router
  .route('/questions/:question_id/helpful')
    .put(controller.helpfulQuestion) // mark a question as helpful
router
  .route('/questions/:question_id/report')
    .put(controller.reportQuestion) // report a question
router
  .route('/answers/:answer_id/helpful')
    .put(controller.helpfulAnswer) // mark an answer as helpful
router
  .route('/answers/:answer_id/report')
    .put(controller.reportAnswer) // report an answer


module.exports = router;