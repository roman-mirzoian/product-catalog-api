# Product Catalog API

REST API for managing an online store's product catalog, plus a minimal React client for browsing, searching, and managing products.

- Full design write-up: [`docs/design-document.md`](docs/design-document.md)
- API reference: Swagger UI at `/api/docs` once the server is running, or the raw spec at `/api/docs.json`
- Ready-to-import requests: [`postman/product-catalog.postman_collection.json`](postman/product-catalog.postman_collection.json)

## Stack

- **Backend:** Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT auth
- **Frontend:** React, Vite, TypeScript, React Query, React Router
- **Tests:** Jest + Supertest (backend), Vitest + React Testing Library (frontend)

## Project layout

```
server/    Express API (routes, controllers, services, repositories, Prisma schema)
client/    React SPA
docs/      Design document
postman/   Postman collection
```

## Running with Docker (recommended)

Requires Docker and Docker Compose.

```bash
cp .env.example .env
docker compose up --build
```

This starts three services:

- `postgres` — PostgreSQL 16
- `api` — the Express API on `http://localhost:4000`, running migrations and seeding an admin user + sample products on startup
- `web` — the React client on `http://localhost:5173`

Default seeded admin credentials come from `.env` (`ADMIN_USERNAME` / `ADMIN_PASSWORD`) — update them before running if you don't want the defaults.

Stop everything with `docker compose down` (add `-v` to also drop the database volume).

## Running locally without Docker

Requires Node.js 20+ and a running PostgreSQL instance.

```bash
npm install   # installs both workspaces (server + client)
```

### Backend

```bash
cd server
cp .env.example .env   # edit DATABASE_URL / TEST_DATABASE_URL / JWT_SECRET / ADMIN_* as needed
npx prisma migrate deploy
npm run seed
npm run dev             # http://localhost:4000
```

### Frontend

```bash
cd client
cp .env.example .env    # VITE_API_URL should point at the running API
npm run dev              # http://localhost:5173
```

## Running tests

```bash
# Backend — needs TEST_DATABASE_URL reachable; migrates it automatically before running
cd server && npm test

# Frontend
cd client && npm test
```

## Environment variables

| Variable            | Used by          | Description                                      |
|----------------------|-------------------|---------------------------------------------------|
| `DATABASE_URL`       | server            | PostgreSQL connection string                        |
| `TEST_DATABASE_URL`  | server (tests)    | Separate database used by the test suite            |
| `JWT_SECRET`         | server            | Signing secret for access tokens                     |
| `ADMIN_USERNAME`     | server            | Seeded admin username                                |
| `ADMIN_PASSWORD`     | server            | Seeded admin password                                |
| `PORT` / `API_PORT`  | server            | Port the API listens on                              |
| `VITE_API_URL`       | client            | Base URL the client calls (baked in at build time)   |

See `.env.example` at the repo root and inside `server/` and `client/` for the full list with defaults.

## API overview

| Method | Path                | Auth required | Description                            |
|--------|---------------------|----------------|------------------------------------------|
| POST   | `/api/auth/login`   | No             | Log in, receive a JWT access token         |
| GET    | `/api/auth/me`      | Yes            | Current authenticated user                  |
| GET    | `/api/products`     | Yes            | Paginated, searchable, filterable list      |
| GET    | `/api/products/:id` | Yes            | Single product                               |
| POST   | `/api/products`     | Yes            | Create a product                              |
| PATCH  | `/api/products/:id` | Yes            | Partially update a product                    |
| DELETE | `/api/products/:id` | Yes            | Soft-delete a product                          |

Full endpoint details, request/response shapes, validation rules, and the reasoning behind key design decisions are in [`docs/design-document.md`](docs/design-document.md).
