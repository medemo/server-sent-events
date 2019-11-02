const evtSource = new EventSource("/garing");

evtSource.addEventListener('randomjoke', event => {
  const joke = JSON.parse(event.data)
  document.querySelector('#setup').innerHTML = joke.setup
  document.querySelector('#punchline').innerHTML = joke.punchline
})