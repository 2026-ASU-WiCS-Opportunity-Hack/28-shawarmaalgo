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
```

Notes:

- `PORT` defaults to `8080`
- `APP_ENV` defaults to `development`
- `DATABASE_URL` must point to a reachable PostgreSQL instance
- `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` are required on first launch when the `users` table is empty
- JWT signing is currently hardcoded in the app and is not yet configurable through env vars

## Auth and User Provisioning
- Public self-registration is disabled.
- Use `POST /api/v1/auth/login` for login.
- Use authenticated `POST /api/v1/users` to create users.
- Allowed managed roles are `chapter_lead`, `coach`, and `content_creator`.
- `super_admin` can create users for any chapter.
- `chapter_lead` can create `chapter_lead`, `coach`, and `content_creator` only for their own chapter.
- No API route can create another `super_admin`.

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
