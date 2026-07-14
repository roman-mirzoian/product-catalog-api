# Design Document — Product Catalog API

Quick rundown of how the API is put together, why it's built this way, and how to try it.

## 1. Endpoints

Single Express app under `/api`, layered `routes → controllers → services → repositories → Prisma`.

| Method | Path                | Auth | Description                                  |
|--------|---------------------|------|-----------------------------------------------|
| POST   | `/api/auth/login`   | –    | Log in, get a JWT                             |
| GET    | `/api/auth/me`      | ✓    | Current user                                  |
| GET    | `/api/products`     | ✓    | List — pagination, search, filters, sorting   |
| GET    | `/api/products/:id` | ✓    | Single product                                |
| POST   | `/api/products`     | ✓    | Create                                        |
| PATCH  | `/api/products/:id` | ✓    | Partial update                                |
| DELETE | `/api/products/:id` | ✓    | Soft delete                                   |

List query params: `page`, `limit`, `q` (search over name/description), `category`, `minPrice` / `maxPrice`, `inStock`, `sort` (`price:asc`, `price:desc`, `name:asc`, `createdAt:desc`).

Interactive docs live at `/api/docs` (Swagger UI) and `/api/docs.json` (raw spec), generated from the same route definitions. There's also a ready-to-import [Postman collection](../postman/product-catalog.postman_collection.json).

## 2. Auth

JWT (HS256), issued by `POST /api/auth/login`, 2-hour expiry. A `requireAuth` middleware checks the `Authorization: Bearer <token>` header on every product route — including the two `GET` ones, since the brief scopes viewing to authorized users, not just writes.

One seeded admin account, no self-registration (not part of the brief), no refresh tokens — a short-lived token is enough for this scope.

## 3. Request/response shape

Lists come back as `{ data: [...], meta: { page, limit, total, totalPages } }`. Single resources are just the object. Errors always look like:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": { "fieldErrors": { "name": ["Required"] } } } }
```

`code` is one of `VALIDATION_ERROR` (400), `UNAUTHORIZED` (401), `NOT_FOUND` (404), `CONFLICT` (409), `INTERNAL_ERROR` (500).

## 4. Data & validation

Validated with Zod at the request boundary, enforced again by the DB where it matters:

| Field         | Rule                                          |
|---------------|-------------------------------------------------|
| `name`        | required, 1–200 chars                            |
| `description` | optional, up to 2000 chars                        |
| `price`       | required, positive, stored as `Decimal(10,2)`      |
| `currency`    | 3-letter code, defaults to `USD`                   |
| `sku`         | required, unique                                    |
| `category`    | required string                                     |
| `stock`       | non-negative integer, defaults to `0`               |
| `imageUrl`    | optional, must be a valid URL                       |

A few assumptions worth flagging: deletes are soft (`isActive = false`) so SKUs and order history don't just disappear; `category` is a plain string rather than its own table, which is enough for exact-match filtering at this scale; search uses Postgres `pg_trgm` for typo-tolerant `ILIKE` matching instead of full-text ranking.

## 5. Trying it out

```bash
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"<ADMIN_PASSWORD>"}' | jq -r .token)

curl "http://localhost:4000/api/products?q=mouse&category=electronics" \
  -H "Authorization: Bearer $TOKEN"

curl -X POST http://localhost:4000/api/products \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Wireless Mouse","price":29.99,"sku":"MOU-100","category":"electronics"}'
```

The rest (update, delete, more search variations) are in the Postman collection — its login request auto-fills the `token` variable for everything after it.

## 6. Trade-offs

- **PATCH, no PUT.** Editing is naturally a partial update from a form; a separate PUT would just duplicate the same logic.
- **One admin role, no refresh tokens.** Enough for this scope — the `role` column is already there if that needs to grow later.
- **Staying on Prisma 5.x and TypeScript 6, not Prisma 7 / TypeScript 7.** Both had major releases very recently — Prisma 7 defaults to its new TypeScript-based query compiler instead of the old Rust engine, and TypeScript 7 is the new native (Go) compiler. Neither has been out long enough for me to trust it on a project I can't babysit afterwards, so this stays on the previous, proven stack for now.
- **Real Postgres for tests, not Testcontainers.** `pretest` runs `prisma migrate deploy` against a real test DB — simpler locally, at the cost of needing Postgres reachable.
- **`VITE_API_URL` is baked in at build time.** Changing the API origin means rebuilding the `web` image.

## 7. Tests

**Backend** (Jest + Supertest, real test DB): auth, full product CRUD, search, pagination, soft delete, and access control on every route.

**Frontend** (Vitest + Testing Library): debounced search and filters, form validation, and the list's loading/error/empty states.

Not covered: end-to-end browser tests and load testing on the search endpoint.
