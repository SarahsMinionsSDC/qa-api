const router = require('express').Router();
const controller = require('./controller.js');

router
  .route('/test')
    .get(controller.get)
  // .route('/questions/:product_id')
  //   .get(controller.get)

module.exports = router;