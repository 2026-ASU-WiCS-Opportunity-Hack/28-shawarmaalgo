# WIAL Backend (Chapters API)

## Requirements
- Go 1.22+
- Postgres 13+

## Environment
Set env vars (example):

```
export PORT=8080
export DATABASE_URL="postgres://postgres:postgres@localhost:5432/wial?sslmode=disable"
```

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

## Swagger
- OpenAPI spec: `/swagger`
- Swagger UI: `/swagger-ui`

## API Base
- `/api/v1`

## Health
- `/health`
