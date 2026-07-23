# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A full-stack Task Management System: Express/TypeScript/Knex/MySQL backend (`backend/`) and a React 19/Vite/TypeScript frontend (`frontend/`). Single-user-scoped tasks with JWT authentication — every task belongs to a `user_id` and all task queries are scoped to the authenticated user.

## Common commands

Run from within `backend/` or `frontend/` respectively (no root-level package.json/workspace).

### Backend (`backend/`)
```
npm run dev              # start dev server (ts-node-dev, auto-restart) on PORT (default 5000)
npm run build             # compile TypeScript to dist/
npm start                 # run compiled dist/index.js
npm run migrate           # run knex migrations (src/config/knexfile.ts)
npm run migrate:rollback  # rollback last migration batch
npm run seed               # run knex seeds (creates admin user from ADMIN_* env vars)
npm run lint               # eslint src --ext .ts
```
There is no test runner configured in this repo.

### Frontend (`frontend/`)
```
npm run dev       # vite dev server on port 5173
npm run build      # tsc -b && vite build
npm run lint        # oxlint
npm run preview     # preview production build
```

### Infrastructure
```
docker-compose up -d      # start MySQL 8.0 on host port 3307 (db: task_manager, root/root)
```
Backend and frontend each need a `.env` populated from their `.env.example` (`backend/.env.example`, `frontend/.env.example`). Backend `.env` must live at `backend/.env` (loaded via `path.resolve(__dirname, '../.env')` from both `src/index.ts` and `src/config/knexfile.ts`).

To stand up the whole stack locally: `docker-compose up -d` → `cd backend && npm run migrate && npm run seed && npm run dev` → `cd frontend && npm run dev`. Default seeded admin login is `admin@test.com` / `123456` (overridable via `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `backend/.env`).

## Architecture

### Backend request flow
Express app (`src/app.ts`) mounts all API routes under `/api` (see `src/routes/index.ts`: `/api/auth`, `/api/tasks`). Route → middleware → controller → model, layered as:
- **Routes** (`src/routes/`) wire `validateBody`/`validateQuery` (Zod schema middleware, `src/middleware/validate.ts`) and `requireAuth` (`src/middleware/auth.ts`) in front of controllers. All `/api/tasks/*` routes require auth (`router.use(requireAuth)` in `taskRoutes.ts`).
- **Controllers** (`src/controllers/`) are wrapped in `asyncHandler` (`src/utils/asyncHandler.ts`) so thrown/rejected errors flow to Express's error middleware instead of needing try/catch per route.
- **Models** (`src/models/`) contain the only Knex query-building code — controllers never touch `db` directly. `taskModel.findAll` builds a shared filtered query (`applyFilters`), clones it once for a `count` and once for the paginated `data` fetch.
- **Errors**: throw `AppError(message, statusCode)` (`src/utils/AppError.ts`) from anywhere in the request lifecycle; `errorHandler` (`src/middleware/errorHandler.ts`) formats `AppError` and `ZodError` into consistent JSON responses (`{ message }` or `{ message, errors: [{field, message}] }`), and everything else falls through to a generic 500.
- **Auth**: JWT (`src/utils/jwt.ts`) signed/verified with `JWT_SECRET`; payload is `{ userId, email }` (`JwtPayload` in `src/types/index.ts`). `requireAuth` attaches `req.user` and is the only source of the current user's id — controllers call a local `getUserId(req)` helper to extract it and throw 401 if absent.
- **Validation**: Zod schemas live in `src/validators/` and are also the source of the inferred TS types (`CreateTaskInput`, `TaskQueryInput`, etc.) used by models/controllers — update the schema, not a separate type, when changing a request shape.

### Database
MySQL via Knex (`src/config/db.ts` wraps `src/config/knexfile.ts`). Two tables: `users` and `tasks` (`user_id` FK with `ON DELETE CASCADE`). Migrations/seeds live in `src/migrations/` and `src/seeds/` and run with the `--knexfile src/config/knexfile.ts` flag baked into the npm scripts — don't invoke bare `knex` commands without that flag. Task `priority` is `Low|Medium|High`, `status` is `Pending|In Progress|Completed`; these enums are duplicated (not shared) between `backend/src/types/index.ts` and `frontend/src/types/index.ts` — keep them in sync manually when changing either.

### Frontend structure
- `src/api/` — thin axios wrappers per resource (`auth.ts`, `tasks.ts`) built on a shared `apiClient` (`src/api/client.ts`) that injects the bearer token from `localStorage` on every request and redirects to `/login` (clearing stored auth) on any `401` response.
- `src/context/AuthContext.tsx` — owns auth state (`user` in-memory + mirrored to `localStorage`); `useAuth()` is the only way components should read/mutate auth state. `ProtectedRoute` gates the dashboard route in `App.tsx` based on `isAuthenticated`.
- `src/hooks/` — data-fetching hooks (`useTasks`, `useTaskStats`) that wrap the `api/tasks.ts` calls with loading/error state; `useTasks` re-fetches on any change to its params object (compared via `JSON.stringify`).
- `src/pages/` (`LoginPage`, `DashboardPage`) compose components from `src/components/` (`TaskList`, `TaskForm`, `TaskFilters`, `Pagination`, `StatCard`, `ConfirmDialog`, `Navbar`, etc.).
- Routing is entirely client-side (`react-router-dom`), two real routes: `/login` and `/` (dashboard), with a catch-all redirect to `/`.
- Styling is Tailwind CSS v4 via the `@tailwindcss/vite` plugin (no separate Tailwind config file — configured directly in `vite.config.ts`).
- Linting uses `oxlint` (not ESLint) — config in `frontend/.oxlintrc.json`.

### Frontend/backend contract
Task list/filter/sort/pagination query params (`search`, `status`, `priority`, `sortBy`, `page`, `limit`) are defined once in `backend/src/validators/taskValidators.ts` (`taskQuerySchema`) and mirrored by hand in `frontend/src/api/tasks.ts` (`TaskQueryParams`) — the two aren't generated from a shared schema, so keep them aligned when changing filtering/sorting behavior.
