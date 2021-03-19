// Dependencies
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const router = require ('./routes.js');

const app = express();
const port = 3000;

// mongoDB connection
mongoose.connect(`mongodb://localhost/questions-answers`, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('mongoose connected');
})

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use('/qa', router)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

