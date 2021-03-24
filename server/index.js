// Dependencies
const express = require('express');
const morgan = require('morgan');
const router = require ('./routes.js');
const newrelic = require('newrelic');
const path = require('path');

const app = express();
const port = 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use('/qa', router)

app.get('/loaderio-4dde61e2dfcf9bb782bc6ce626d88010', (req, res) => {
  res.send('loaderio-4dde61e2dfcf9bb782bc6ce626d88010')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

