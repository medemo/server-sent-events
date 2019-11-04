// const evtSource = new EventSource("/garing");

// evtSource.addEventListener('randomjoke', event => {
//   const joke = JSON.parse(event.data)
//   document.querySelector('#setup').innerHTML = joke.setup
//   document.querySelector('#punchline').innerHTML = joke.punchline
// })

var app = new Vue({
  el: '#todos',
  data: {
    todos: [],
    newTodo: ''
  },
  mounted: function () {
    const evtSource = new EventSource("/todos");
    evtSource.addEventListener('todos', event => {
      const todos = JSON.parse(event.data)
      this.todos = todos
    })
    evtSource.addEventListener('newtodo', event => {
      const todo = JSON.parse(event.data)
      this.todos.push(todo)
    })
    evtSource.addEventListener('deltodo', event => {
      const id = Number(event.data)
      this.todos.splice(this.todos.findIndex(todo => todo.id === id), 1)
    })
  },
  methods: {
    submitTodo: async function () {
      await fetch('/todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          todo: this.newTodo
        })
      })
      this.newTodo = ''
    },
    delTodo: async function (id) {
      await fetch('/todo', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
    }
  }
})