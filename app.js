const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const EventEmitter = require('events')

const jokes = require('./jokes.json');

const app = express();

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

const todos = [
  {
    id: 1,
    todo: 'Write todo'
  }
]

const todoEmitter = new EventEmitter();

app.get('/todos', (req, res) => {
  res.set('Content-Type', 'text/event-stream')
  res.write(`
    \nevent: todos
    \ndata: ${JSON.stringify(todos)}
    \n\n
  `)
  todoEmitter.on('newtodo', function (todo) {
    res.write(`
      \nevent: newtodo
      \ndata: ${JSON.stringify(todo)}
      \n\n
    `)
  })
  todoEmitter.on('deltodo', function (id) {
    res.write(`
      \nevent: deltodo
      \ndata: ${id}
      \n\n
    `)
  })
})

app.post('/todo', (req, res) => {
  const todo = {
    id: todos[todos.length - 1].id + 1,
    todo: req.body.todo
  }
  todos.push(todo)
  todoEmitter.emit('newtodo', todo)
  res.json({ success: true })
})

app.delete('/todo', (req, res) => {
  const id = Number(req.body.id)
  todos.splice(todos.findIndex(todo => todo.id === id), 1)
  todoEmitter.emit('deltodo', id)
  res.json({ success: true })
})

module.exports = app;
