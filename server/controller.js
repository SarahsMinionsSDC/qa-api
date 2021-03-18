// require db helpers

const controller = {
  get: (req, res) => {
    // params page (default 1), count (default 5), product_id
    res.send('greetings')
  }
}

module.exports = controller;