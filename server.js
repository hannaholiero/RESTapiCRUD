const express = require('express');
// const mongoose = require('mongoose');

const app = express();
//routes
app.get('/', (req, res) => {
  res.send('Hello API!')
})


app.listen(3024, () => {
  console.log('listening on port 3024')
})

