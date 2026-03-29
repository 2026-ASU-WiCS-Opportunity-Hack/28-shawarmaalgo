# WIAL Backend

The backend is a Go + Gin API for chapters, coaches, events, team members, resources, testimonials, global pages, uploads, and role-based portal access.

## Links
- [Project README](../README.md)
- [Frontend Documentation](../frontend/README.md)
- [OpenAPI Spec](./api/openapi.yaml)
- [Production Swagger UI](https://backend-production-3478.up.railway.app/swagger-ui)

## What This Service Owns
- Login-based authentication and `GET /api/v1/me`
- Public read APIs for chapters, coaches, events, team members, resources, testimonials, and global pages
- Protected CRUD for users, chapters, coaches, events, team members, resources, testimonials, and global pages
- Portal summary endpoints for super admins and chapter-level users
- Image upload handling through an S3-compatible storage layer
- Demo AI and payment endpoints used for hackathon exploration

## Request Flow
```mermaid
flowchart LR
  Client["Frontend or API client"] --> Router["Gin router"]
  Router --> Auth["Auth and role middleware"]
  Auth --> Handlers["Domain handlers"]
  Handlers --> Store["db.Store"]
  Store --> Postgres["PostgreSQL"]
  Handlers --> Uploads["S3 upload service"]
  Uploads --> MinIO["MinIO bucket"]
  Handlers --> Response["JSON response"]
```

## Requirements
- [Go 1.25+](https://go.dev/)
- [PostgreSQL 13+](https://www.postgresql.org/)
- An S3-compatible bucket for uploads in environments outside the local Compose stack

## Environment
The backend loads environment variables from `backend/.env` if the file exists.

Start from the shared template at [`../.env.example`](../.env.example) and copy the backend values into `backend/.env`:

```bash
PORT=8080
APP_ENV=development
DATABASE_URL=postgres://postgres:postgres@localhost:5432/wial?sslmode=disable
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=change-me-in-local-dev
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_BUCKET=wial-images
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
S3_USE_PATH_STYLE=true
S3_PUBLIC_BASE_URL=http://localhost:9000/wial-images
MAX_UPLOAD_SIZE_BYTES=10485760
```

Notes:
- `PORT` defaults to `8080`
- `APP_ENV` defaults to `development`
- `DATABASE_URL` must point to a reachable PostgreSQL instance
- `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` are required on first launch when the `users` table is empty
- `CORS_ALLOWED_ORIGINS` should include the frontend origin
- `S3_*` config powers image uploads for coach profiles, chapter content, and other managed assets
- `MAX_UPLOAD_SIZE_BYTES` defaults to `10485760` bytes, or 10 MiB

## Run
### Local Go process
```bash
cd backend
go run ./cmd/server
```

### Docker Compose
From the repo root:

```bash
docker compose up --build
```

Before using the shared Compose file in a new environment, review [`../docker-compose.yml`](../docker-compose.yml) so the database, migration, and storage settings match your target setup.

## Migrations
SQL migrations live in [`./migrations`](./migrations). They are compatible with [`golang-migrate`](https://github.com/golang-migrate/migrate).

Example:

```bash
migrate -path ./migrations -database "$DATABASE_URL" up
```

## Endpoint Groups
- Auth: `POST /api/v1/auth/login`
- Session/profile: `GET /api/v1/me`, `PATCH /api/v1/me/coach`
- Portal: `GET /api/v1/portal/overview`, `GET /api/v1/portal/chapter`
- Public content: `GET /api/v1/chapters`, `GET /api/v1/coaches`, `GET /api/v1/events`, `GET /api/v1/team-members`, `GET /api/v1/resources`, `GET /api/v1/testimonials`, `GET /api/v1/global-pages`
- Management CRUD: `/api/v1/users`, `/api/v1/chapters`, `/api/v1/coaches`, `/api/v1/events`, `/api/v1/team-members`, `/api/v1/resources`, `/api/v1/testimonials`, `/api/v1/global-pages`
- Uploads: `POST /api/v1/uploads/images`
- Demo endpoints: `GET /api/v1/ai/coach-search`, `POST /api/v1/ai/generate-chapter`, `POST /api/v1/payments/create-session`

For full request and response schemas, use the [OpenAPI spec](./api/openapi.yaml) or open Swagger UI at [`http://localhost:8080/swagger-ui`](http://localhost:8080/swagger-ui) when the service is running.

For the deployed docs, use [https://backend-production-3478.up.railway.app/swagger-ui](https://backend-production-3478.up.railway.app/swagger-ui).

## Role Access
- `super_admin` has global access across managed users, chapters, coaches, events, resources, testimonials, and global pages
- `chapter_lead` is scoped to their own chapter for chapter, coach, event, team-member, resource, and testimonial management
- `content_creator` can update only chapter content through `PATCH /api/v1/chapters/:id/content`
- `coach` can update only their own coach profile through `PATCH /api/v1/me/coach`

## Image Uploads
- Authenticated users can upload images through `POST /api/v1/uploads/images`
- Requests must use `multipart/form-data` with a single `file` field
- Supported image types are `jpeg`, `png`, `gif`, and `webp`
- Successful uploads return a public object URL, storage key, content type, and size

## Notes for the Hackathon Build
- The AI search route currently performs a keyword-style search while documenting the intended AI-ready extension point
- The payment session route currently returns a simulated checkout session
- Public user registration is intentionally disabled; managed users are created by authenticated admins
