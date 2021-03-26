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

app.get('/loaderio-9893bd0bc1dd3e4997d8ae8cc258995c', (req, res) => {
  res.send('loaderio-9893bd0bc1dd3e4997d8ae8cc258995c')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

