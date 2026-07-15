# Task API

A simple Node.js + Express CRUD API for managing tasks in memory.

## Run locally

```bash
npm install
npm start
```

Then open:
- http://localhost:3000
- http://localhost:3000/docs

## Available endpoints

- GET /tasks
- GET /tasks/:id
- POST /tasks
- PUT /tasks/:id
- DELETE /tasks/:id

## Notes

The task list is stored in memory, so restarting the server will clear all tasks.
