const LineByLineReader = require('line-by-line');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Question = require('../db/schemas/question.js');
const Answer = require('../db/schemas/answer.js');
const answers_csv = path.join(__dirname, '../db/data/answers.csv')

mongoose.connect(`mongodb://localhost/questions-answers`, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('mongoose on');
});

const stream = new LineByLineReader(answers_csv);

db.on("open", function (err, conn) {

  var bulk = Question.collection.initializeOrderedBulkOp();
  var counter = 0;

  stream.on("error", function (err) {
    console.log(err);
  });

  stream.on("line", function (line) {
    var row = line.split(",");     // split the lines on delimiter

    // helpers to clean data
    var cleanString = (str) => {
      let result = ''
      for (let i = 0; i < str.length; i++) {
        if (i === 0 || i === str.length - 1) {
          if ((/[a-zA-Z]/).test(str[i])) {
            result += str[i]
          }
        } else {
          result += str[i]
        }
      }
      return result
    }

    var numToBool = (n) => {
      return n === 1 ? true : false
    }

    var answerObj = new Answer({
      answer_id: Number(row[0]),
      question_id: Number(row[1]),
      body: cleanString(row[2]),
      date: row[3],
      answerer_name: cleanString(row[4]),
      answerer_email: cleanString(row[5]),
      reported: numToBool(Number(row[6])),
      helpfulness: Number(row[7]),
      photos: []
    });

    // change to updateOne and $addToSet when seeding again
    // bulk.find({ question_id: Number(row[1]) }).upsert().update({ $push: { answers: answerObj } })
    bulk.find({ question_id: Number(row[1]) }).updateOne({ $addToSet: { answers: answerObj } })

    counter++;

    if (counter % 1000 === 0) {
      stream.pause();

      bulk.execute(function (err, result) {
        if (err) throw err;
        bulk = Question.collection.initializeOrderedBulkOp();
        stream.resume();
      });
    }
  });

  stream.on("end", function () {
    console.log("done seeding answers")
    if (counter % 1000 != 0) {
      bulk.execute(function (err, result) {
        if (err) throw err;
      });
    }
  });

})