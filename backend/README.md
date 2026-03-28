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
```

Notes:

- `PORT` defaults to `8080`
- `APP_ENV` defaults to `development`
- `DATABASE_URL` must point to a reachable PostgreSQL instance
- JWT signing is currently hardcoded in the app and is not yet configurable through env vars

## Migrations
This scaffold uses SQL migrations compatible with `golang-migrate`.

Example (install migrate CLI separately):

```
migrate -path ./migrations -database "$DATABASE_URL" up
```

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
