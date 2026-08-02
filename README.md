# Task API

A simple Node.js + Express API for managing tasks with SQLite persistence and Supabase authentication.

## Launch page

This repository includes a near-blank portfolio launch page in `docs/`, deployed through GitHub Pages. After enabling **Settings → Pages → Build and deployment → Source: GitHub Actions**, its live URL will be:

`https://moatazadham02.github.io/task-api/`

The materials to copy into the Claude Project for the next build week are in [`docs/CLAUDE-PROJECT-MATERIALS.md`](docs/CLAUDE-PROJECT-MATERIALS.md).

## Run locally

```bash
cp .env.example .env
npm install
node index.js
```

Then open:
- http://localhost:3000
- http://localhost:3000/docs

## Environment

Create a local `.env` file using the example:

```bash
cp .env.example .env
```

Add your Supabase values:

```env
PORT=3000
SUPABASE_URL=https://your-project-url.supabase.co
SUPABASE_KEY=your-anon-key
```

## Available endpoints

| Method | Endpoint | Authentication |
| --- | --- | --- |
| GET | `/public/info` | No |
| POST | `/auth/signup` | No |
| POST | `/auth/login` | No |
| POST | `/auth/logout` | Bearer token |
| GET | `/protected/profile` | Bearer token |
| GET | `/protected/dashboard` | Bearer token |
| GET, POST | `/tasks` | No |
| GET, PUT, DELETE | `/tasks/:id` | No |

## Auth flow

1. Sign up with `POST /auth/signup`
2. Log in with `POST /auth/login`
3. Copy the returned `access_token`
4. Send it as `Authorization: Bearer <token>` to `/protected/profile`

## Swagger UI

Open http://localhost:3000/docs to try the protected routes and authorize with a bearer token.

## Tests

Run the local repository and authorization-header checks with:

```bash
npm test
```
