// Dependencies
const express = require('express');
const morgan = require('morgan');
const router = require ('./routes.js');
const newrelic = require('newrelic');

const app = express();
const port = 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use('/qa', router)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

