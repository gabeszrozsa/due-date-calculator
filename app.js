const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index.html');
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
