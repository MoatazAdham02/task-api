require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const SqliteTaskRepository = require('./repositories/sqliteTaskRepository');
const { requireAuth, signup, login, logout } = require('./auth');

const app = express();
const port = process.env.PORT || 3000;
const repository = new SqliteTaskRepository();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Task API');
});

app.get('/public/info', (req, res) => {
  res.status(200).json({ message: 'Welcome stranger! This info is public.' });
});

app.post('/auth/signup', signup);
app.post('/auth/login', login);
app.post('/auth/logout', requireAuth, logout);

app.get('/protected/profile', requireAuth, (req, res) => {
  res.status(200).json({
    id: req.user.id,
    email: req.user.email,
    created_at: req.user.created_at
  });
});

app.get('/protected/dashboard', requireAuth, (req, res) => {
  res.status(200).json({ message: 'Welcome to your dashboard' });
});

app.get('/tasks', async (req, res) => {
  const tasks = await repository.list();
  res.json(tasks);
});

app.get('/tasks/:id', async (req, res) => {
  const taskId = Number(req.params.id);
  const task = await repository.getById(taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});

app.post('/tasks', async (req, res) => {
  const { title } = req.body;

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = await repository.create({
    title: title.trim(),
    done: false
  });

  res.status(201).json(newTask);
});

app.put('/tasks/:id', async (req, res) => {
  const taskId = Number(req.params.id);
  const task = await repository.getById(taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, done } = req.body;
  const updates = {};

  if (typeof title !== 'undefined') {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    updates.title = title.trim();
  }

  if (typeof done !== 'undefined') {
    if (typeof done !== 'boolean') {
      return res.status(400).json({ error: 'Done must be a boolean' });
    }
    updates.done = done;
  }

  const updatedTask = await repository.update(taskId, updates);
  res.json(updatedTask);
});

app.delete('/tasks/:id', async (req, res) => {
  const taskId = Number(req.params.id);
  const deleted = await repository.delete(taskId);

  if (!deleted) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(204).send();
});

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'openapi.json'), 'utf8')
);

app.get('/openapi.json', (req, res) => {
  res.json(swaggerDocument);
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server running and connected to Supabase`);
  console.log(`Server listening on http://localhost:${port}`);
});
