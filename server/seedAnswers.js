// const LineByLineReader = require('line-by-line');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Question = require('../db/schemas/question.js');
const Answer = require('../db/schemas/answer.js');
const answers_csv = path.join(__dirname, '../db/data/answers.csv')
const byline = require('byline');


mongoose.connect('mongodb://jake:sdcpassword@54.219.31.59:27017/questions-answers', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('mongoose on');
});

// const stream = new LineByLineReader(answers_csv);
const fsStream = fs.createReadStream(answers_csv);
const stream = byline.createStream(fsStream);

db.on("open", function (err, conn) {
  console.log("starting seed answers")

  var bulk = Question.collection.initializeOrderedBulkOp();
  var counter = 0;

  stream.on("error", function (err) {
    console.log(err);
  });

  stream.on("data", function (line) {
    var row = line.toString('utf-8').split(",");     // split the lines on delimiter

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
      date: cleanString(row[3]),
      answerer_name: cleanString(row[4]),
      answerer_email: cleanString(row[5]),
      reported: numToBool(Number(row[6])),
      helpfulness: Number(row[7]),
      photos: []
    });

    // bulk.find({ question_id: Number(row[1]) }).upsert().update({ $push: { answers: answerObj } })
    bulk.find({ question_id: Number(row[1]) }).updateOne({ $addToSet: { answers: answerObj } })
    // bulk.findOneAndUpdate({question_id: Number(row[1])}, {$addToSet: { answers:  answerObj } })

    counter++;
    if (counter % 100000 === 0) {
      console.log(counter)
    }

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