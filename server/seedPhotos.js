// const LineByLineReader = require('line-by-line');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Question = require('../db/schemas/question.js');
const Photo = require('../db/schemas/photo.js');
const answers_photos_csv = path.join(__dirname, '../db/data/answers_photos.csv')
const byline = require('byline');


mongoose.connect('mongodb://jake:sdcpassword@54.219.31.59:27017/questions-answers', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('mongoose on');
});

// const stream = new LineByLineReader(answers_photos_csv);
const fsStream = fs.createReadStream(answers_photos_csv);
const stream = byline.createStream(fsStream);

db.on("open", function (err, conn) {
  console.log("starting seed photos")

  var bulk = Question.collection.initializeOrderedBulkOp();
  var counter = 0;

  stream.on("error", function (err) {
    console.log(err);
  });

  stream.on("data", function (line) {
    var row = line.toString('utf-8').split(",");     // split the lines on delimiter

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

    var photoObj = new Photo({
      id: Number(row[0]),
      answer_id: Number(row[1]),
      url: cleanString(row[2])
    });

    // https://docs.mongodb.com/manual/reference/operator/update/addToSet/
    bulk.find({ answers: { $elemMatch: { answer_id: Number(row[1]) } } }).updateOne({ $addToSet: { "answers.$.photos": photoObj } })
    // bulk.find({ answers: { $elemMatch: { answer_id: Number(row[1]) } } }).upsert().update({ $addToSet: { "answers.$.photos": photoObj } })

    counter++;
    if (counter % 10000 === 0) {
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
    console.log("done seeding photos")
    if (counter % 1000 != 0) {
      bulk.execute(function (err, result) {
        if (err) throw err;
      });
    }
  });

})