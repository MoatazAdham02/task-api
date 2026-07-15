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

app.get('/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id);
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
