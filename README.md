# Task Management System

A full-stack task management app built for the Koncepthive Full Stack Web Developer Intern technical assessment. Users log in and manage their own tasks — create, edit, delete, search, filter, sort, and paginate — with a live dashboard summarizing task counts by status.

## Project Overview

- Single-user-scoped task manager behind JWT authentication (no self-registration — one seeded admin account).
- Dashboard shows Total / Pending / In Progress / Completed / Overdue task counts.
- Full CRUD on tasks, each with title, description, priority, status, and due date.
- Search by title, filter by status/priority (combinable), sort by newest/oldest/due date, and paginated results.
- Validation is enforced on both the client (immediate feedback) and the server (source of truth, via Zod).

## Technology Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 19, TypeScript, Vite, React Router, Tailwind CSS v4, Axios, react-hot-toast |
| Backend   | Node.js, Express, TypeScript, Knex.js |
| Database  | MySQL 8.0 |
| Auth      | JWT (`jsonwebtoken`), password hashing with `bcryptjs` |
| Validation| Zod (schemas double as the source of TypeScript types) |
| Tooling   | ESLint (backend), Oxlint (frontend), Docker Compose (MySQL) |

## Project Structure

```
task/
├── backend/     # Express + TypeScript API, Knex migrations/seeds
├── frontend/    # React + Vite SPA
├── database/    # Schema reference (SQL dump); migrations are the source of truth
├── docker-compose.yml  # MySQL 8.0 service
└── README.md
```

## Installation Instructions

Prerequisites: Node.js 18+, npm, and either a local MySQL 8 server or Docker.

```bash
git clone <repository-url>
cd task

# Install dependencies for both apps
cd backend && npm install
cd ../frontend && npm install
```

## Environment Variables

Each app has its own `.env`, based on the committed `.env.example` files.

**`backend/.env`** (copy from `backend/.env.example`):

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the API listens on | `5000` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3307` (matches the Docker Compose mapping) |
| `DB_USER` | MySQL user | `root` |
| `DB_PASSWORD` | MySQL password | `root` |
| `DB_NAME` | MySQL database name | `task_manager` |
| `JWT_SECRET` | Secret used to sign JWTs — set this to a long random string | — |
| `JWT_EXPIRES_IN` | JWT lifetime | `1d` |
| `CORS_ORIGIN` | Allowed origin for the frontend | `http://localhost:5173` |
| `ADMIN_NAME` | Name for the seeded admin user | `Admin` |
| `ADMIN_EMAIL` | Login email for the seeded admin user | `admin@test.com` |
| `ADMIN_PASSWORD` | Login password for the seeded admin user | `123456` |

**`frontend/.env`** (copy from `frontend/.env.example`):

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API | `http://localhost:5000/api` |

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

## Database Setup

MySQL 8.0 is provided via Docker Compose (exposed on host port `3307` to avoid clashing with a local MySQL install):

```bash
docker-compose up -d
```

If you'd rather use an existing MySQL instance, just point `DB_HOST`/`DB_PORT`/`DB_USER`/`DB_PASSWORD`/`DB_NAME` in `backend/.env` at it instead.

Then, from `backend/`, run the Knex migrations and seed the admin user:

```bash
cd backend
npm run migrate   # creates the users and tasks tables
npm run seed       # inserts the admin user from ADMIN_* env vars
```

Migration files live in `backend/src/migrations/`; they are the source of truth for the schema. A plain SQL reference dump of the resulting schema is also included at `database/schema.sql`.

To roll back the last migration batch: `npm run migrate:rollback`.

## Running the Backend

```bash
cd backend
npm run dev     # ts-node-dev, auto-restarts on change, listens on PORT (default 5000)
```

Production build:

```bash
npm run build   # compiles to dist/
npm start        # runs dist/index.js
```

Health check: `GET http://localhost:5000/api/health` → `{ "status": "ok" }`

## Running the Frontend

```bash
cd frontend
npm run dev      # Vite dev server on http://localhost:5173
```

Production build:

```bash
npm run build    # tsc -b && vite build, output in dist/
npm run preview  # serve the production build locally
```

## Default Login

```
Email:    admin@test.com
Password: 123456
```

(Configurable via `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `backend/.env` before running `npm run seed`.)

## API Documentation

All endpoints are prefixed with `/api`. All `/api/tasks/*` routes require `Authorization: Bearer <token>`.

### `POST /api/auth/login`
Authenticate and receive a JWT.

Request body:
```json
{ "email": "admin@test.com", "password": "123456" }
```
Response `200`:
```json
{ "token": "<jwt>", "user": { "id": 1, "name": "Admin", "email": "admin@test.com" } }
```
Response `401`: `{ "message": "Invalid email or password" }`

### `GET /api/tasks`
List the authenticated user's tasks, with search, filtering, sorting, and pagination.

Query params (all optional):

| Param | Values | Default |
|---|---|---|
| `search` | matches task title (partial) | — |
| `status` | `Pending` \| `In Progress` \| `Completed` | — |
| `priority` | `Low` \| `Medium` \| `High` | — |
| `sortBy` | `newest` \| `oldest` \| `dueDate` | `newest` |
| `page` | positive integer | `1` |
| `limit` | positive integer, max `100` | `10` |

Response `200`:
```json
{
  "data": [ { "id": 1, "title": "...", "priority": "High", "status": "Pending", "due_date": "2026-08-01", "...": "..." } ],
  "pagination": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
}
```

### `GET /api/tasks/stats`
Dashboard counts for the authenticated user.

Response `200`:
```json
{ "total": 5, "pending": 2, "inProgress": 1, "completed": 1, "overdue": 1 }
```

### `GET /api/tasks/:id`
Fetch a single task (must belong to the authenticated user). `404` if not found.

### `POST /api/tasks`
Create a task.

Request body:
```json
{
  "title": "Write report",
  "description": "optional",
  "priority": "Medium",
  "status": "Pending",
  "due_date": "2026-08-01"
}
```
`title`, `priority`, `status`, and `due_date` are required; `due_date` must not be earlier than today. Response `201` with the created task.

### `PUT /api/tasks/:id`
Update a task (all fields optional — partial update). Same validation rules as create. `404` if the task doesn't belong to the authenticated user.

### `DELETE /api/tasks/:id`
Delete a task. Response `204` on success, `404` if not found.

### Error format
Validation errors (`400`):
```json
{ "message": "Validation failed", "errors": [ { "field": "title", "message": "Title is required" } ] }
```
Other errors: `{ "message": "..." }` with an appropriate status code (`401`, `404`, `500`, etc.).

## Assumptions Made

- No registration flow is needed — a single admin user is seeded from `backend/.env`, per the assessment brief.
- "Tasks" are scoped per user (the schema and API support multiple users even though only one is seeded), rather than a single global task list — this matches how the `users`/`tasks` foreign key is described in the assessment's minimum schema.
- Search is a case-insensitive partial match on title only, as specified.
- "Overdue" means `due_date` is before today and `status` is not `Completed` — an overdue task keeps counting as overdue (not "Completed") until it's marked complete or its due date is edited.
- Pagination, loading indicators, and toast notifications were implemented as bonus features since they're low-cost and directly improve usability of the list/CRUD flows.

## Known Limitations

- No refresh-token flow — the JWT simply expires after `JWT_EXPIRES_IN` (default 1 day) and the user is redirected to `/login`.
- No automated test suite yet.
- Not containerized end-to-end — Docker Compose currently provisions MySQL only; the API and frontend are run directly with Node/npm.
- No dark mode.
- Not deployed — see the section below if a live URL is required for submission.

## Deployment

This submission is set up to run locally via the steps above. If a hosted URL is required, the backend can be deployed as-is to Render/Railway (build: `npm run build`, start: `npm start`, plus the same environment variables against a managed MySQL instance), and the frontend to Vercel/Netlify (build: `npm run build`, output directory: `dist/`, with `VITE_API_BASE_URL` pointing at the deployed backend).

- Frontend URL: _not deployed_
- Backend URL: _not deployed_
"# Task-Management-System" 
