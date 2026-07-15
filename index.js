const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

let tasks = [
  { id: 1, title: 'Buy milk', done: false },
  { id: 2, title: 'Learn Node.js', done: true }
];

app.get('/', (req, res) => {
  res.send('Hello from Task API');
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
