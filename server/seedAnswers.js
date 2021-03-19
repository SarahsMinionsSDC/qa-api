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

db.on("open",function(err,conn) {

  var bulk = Question.collection.initializeOrderedBulkOp();
  var counter = 0;

  stream.on("error",function(err) {
    console.log(err);
  });

  stream.on("line",function(line) {
      var row = line.split(",");     // split the lines on delimiter

      // todo: clean data
      var answerObj = new Answer({
        a_id: Number(row[0]),
        question_id: Number(row[1]),
        body: row[2],
        date_written: row[3],
        answerer_name: row[4],
        answerer_email: row[5],
        reported: Number(row[6]),
        helpful: Number(row[7]),
        photos: []
      });

      // change to updateOne and $addToSet when seeding again
      bulk.find( { q_id: Number(row[1]) } ).upsert().update( { $push: { answers: answerObj } })

      counter++;

      if ( counter % 1000 === 0 ) {
          stream.pause();

          bulk.execute(function(err,result) {
              if (err) throw err;
              bulk = Question.collection.initializeOrderedBulkOp();
              stream.resume();
          });
      }
  });

  stream.on("end",function() {
    console.log("done seeding answers")
      if ( counter % 1000 != 0 ) {
          bulk.execute(function(err,result) {
              if (err) throw err;
          });
      }
  });

})