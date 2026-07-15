const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let tasks = [
  { id: 1, title: 'Buy milk', done: false },
  { id: 2, title: 'Learn Node.js', done: true }
];

let nextId = 3;

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

app.post('/tasks', (req, res) => {
  const { title } = req.body;

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    done: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id);
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, done } = req.body;

  if (typeof title !== 'undefined') {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    task.title = title.trim();
  }

  if (typeof done !== 'undefined') {
    if (typeof done !== 'boolean') {
      return res.status(400).json({ error: 'Done must be a boolean' });
    }
    task.done = done;
  }

  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id);
  const taskIndex = tasks.findIndex((item) => item.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
