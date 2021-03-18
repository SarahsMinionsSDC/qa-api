const axios = require('axios');
// endpoint localhost:27017/questions-answers

module.exports.getQuestionsByProductId = (id, callback) => {
  const options = {
    method: 'get',
    url: 'localhost:27017/questions-answers',
    headers: {
      'User-Agent': 'request'
    }
  }

  axios(options)
    .then((response) => {
      callback(null, response.data)
    })
    .catch((err) => {
      callback(err)
    })
}

