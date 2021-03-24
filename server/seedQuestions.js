// const LineByLineReader = require('line-by-line');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Question = require('../db/schemas/question.js');
const questions_csv = path.join(__dirname, '../db/data/questions.csv')
const byline = require('byline');

mongoose.connect('mongodb://jake:sdcpassword@54.219.31.59:27017/questions-answers', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('mongoose on');
});

// const stream = new LineByLineReader(questions_csv);
const fsStream = fs.createReadStream(questions_csv);
const stream = byline.createStream(fsStream);

db.on("open", function (err, conn) {
  console.log("starting seed questions")
  var bulk = Question.collection.initializeOrderedBulkOp();
  var counter = 0;
  stream.on("error", function (err) {
    console.log(err);
  });

  stream.on("data", function (line) {
    var row = line.toString('utf-8').split(","); // split the lines on delimiter

    // helpers to clean data
    var cleanString = (str) => {
      let result = ''
      for (let i = 0; i < str.length; i++) {
        // only add first and last char if it's an alphabet character
        if (i === 0 || i === str.length - 1) {
          // https://coderrocketfuel.com/article/how-to-check-if-a-character-is-a-letter-using-javascript
          if ((/[a-zA-Z]/).test(str[i])) {
            result += str[i]
          }
        } else {
          // other than that use the whole string
          result += str[i]
        }
      }
      return result
    }

    var numToBool = (n) => {
      return n === 1 ? true : false
    }

    var questionObj = new Question({
      question_id: Number(row[0]),
      product_id: Number(row[1]),
      question_body: cleanString(row[2]),
      question_date: cleanString(row[3]),
      asker_name: cleanString(row[4]),
      asker_email: cleanString(row[5]),
      reported: numToBool(Number(row[6])),
      helpfulness: Number(row[7]),
      answers: []
    })

    bulk.insert(questionObj);

    counter++;
    if (counter % 100000 === 0) {
      console.log(counter)
    }

    if (counter % 1000 === 0) {
      stream.pause(); //lets stop reading from file until we finish writing this batch to db

      bulk.execute(function (err, result) {
        if (err) throw err;

        bulk = Question.collection.initializeOrderedBulkOp();

        stream.resume(); //continue to read from file
      });
    }
  });

  stream.on("end", function () {
    console.log("done seeding questions")
    if (counter % 1000 != 0) {
      bulk.execute(function (err, result) {
        if (err) throw err;
      });
    }
  });

})

