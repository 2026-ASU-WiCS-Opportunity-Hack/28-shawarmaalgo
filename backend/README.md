# WIAL Backend (Chapters API)

## Requirements
- Go 1.22+
- Postgres 13+

## Environment
The backend loads environment variables from `backend/.env` if the file exists.

Use the shared template at [`.env.example`](/Users/beybutabdulrahimov/Documents/28-shawarmaalgo/.env.example) and copy these values into `backend/.env`:

```
PORT=8080
APP_ENV=development
DATABASE_URL=postgres://postgres:postgres@localhost:5432/wial?sslmode=disable
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=change-me-in-local-dev
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Notes:

- `PORT` defaults to `8080`
- `APP_ENV` defaults to `development`
- `DATABASE_URL` must point to a reachable PostgreSQL instance
- `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` are required on first launch when the `users` table is empty
- `CORS_ALLOWED_ORIGINS` controls which browser origins may call the API; by default local frontend origins on port `3000` are allowed
- JWT signing is currently hardcoded in the app and is not yet configurable through env vars

## Auth and User Provisioning
- Public self-registration is disabled.
- Use `POST /api/v1/auth/login` for login.
- Use authenticated `POST /api/v1/users` to create users.
- Allowed managed roles are `chapter_lead`, `coach`, and `content_creator`.
- `super_admin` can create users for any chapter.
- `chapter_lead` can create `chapter_lead`, `coach`, and `content_creator` only for their own chapter.
- No API route can create another `super_admin`.

## Role Access
- `super_admin` has global access across chapter, coach, event, and managed-user endpoints.
- `chapter_lead` can create users, coaches, and events only for their own chapter, and can update/delete only their own chapter.
- Coach profiles are public through `GET /api/v1/coaches/:id`.
- Public coach discovery is available through `GET /api/v1/coaches` with filters such as `chapter_id`, `certification_level`, `language`, and `specialization`.
- `content_creator` can access `PATCH /api/v1/chapters/:id/content` only for their own chapter.

## Chapter Rules
- Each chapter must belong to a country.
- Each country can have only one chapter.
- Chapter create/update/patch requests return `409 Conflict` when either `slug` or `country` is already in use.

## Migrations
This scaffold uses SQL migrations compatible with `golang-migrate`.

Example (install migrate CLI separately):

```
migrate -path ./migrations -database "$DATABASE_URL" up
```

With Docker Compose from the repo root, migrations run automatically before the backend starts:

```bash
docker compose up --build
```

The compose stack uses:

- `postgres` for the database
- `migrate` as a one-shot migration runner
- `backend` for the Go API

## Run
```
go run ./cmd/server
```

The server starts on `http://localhost:8080` by default.

## Swagger
- OpenAPI spec: `/swagger`
- Swagger UI: `/swagger-ui`

## API Base
- `/api/v1`

## Health
- `/health`
