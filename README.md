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

## Persistence verification (example)

Run these commands to verify data persists across restarts:

```bash
# create a task
curl -sS -X POST http://localhost:3000/tasks \
	-H "Content-Type: application/json" \
	-d '{"title":"persistence check"}' | jq .

# list tasks (should include the created task)
curl -sS http://localhost:3000/tasks | jq .

# stop containers (keeps the Postgres volume)
docker compose down

# start again
docker compose up --build -d

# re-check tasks (task should still be present)
curl -sS http://localhost:3000/tasks | jq .
```

Notes:
- If you don't have `jq` installed, omit the `| jq .` parts.
- Do NOT run `docker compose down --volumes` — that will remove the Postgres data volume and delete your data.
