# Task API

A simple Node.js + Express CRUD API for managing tasks with a PostgreSQL-backed repository.

## Run locally with Docker Compose

```bash
docker compose up --build
```

Then open:
- http://localhost:3000
- http://localhost:3000/docs

## Environment

Create a local .env file using the example:

```bash
cp .env.example .env
```

The app reads the Postgres connection string from the DATABASE_URL environment variable.

## Available endpoints

- GET /tasks
- GET /tasks/:id
- POST /tasks
- PUT /tasks/:id
- DELETE /tasks/:id

## Persistence note

The app now uses PostgreSQL instead of an in-memory array, so tasks persist across app and container restarts. The persistence check is to create a task, restart the app/container, and confirm the task is still returned from GET /tasks.
