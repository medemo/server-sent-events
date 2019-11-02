var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var jokes = require('./jokes.json');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/garing', (req, res) => {
  res.set('Content-Type', 'text/event-stream')
  const sendJokeEvent = () => {
    const index = Math.floor(Math.random() * jokes.length)
    res.write(`
      \nevent: randomjoke
      \ndata: ${JSON.stringify(jokes[index])}
      \n\n
    `)
  }
  sendJokeEvent()
  setInterval(sendJokeEvent, 5000)
});

module.exports = app;
