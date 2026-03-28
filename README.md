# 2026_spring_wics_asu Hackathon Project

## Quick Links
- [Hackathon Details](https://www.ohack.dev/hack/2026_spring_wics_asu)
- [DevPost Submission](https://wics-ohack-sp26-hackathon.devpost.com/)
- [Team Slack Channel](https://opportunity-hack.slack.com/app_redirect?channel=team-28-shawarmaalgo)

## Team "shawarmaalgo"
- Humza Faisal
- Beybut Abdulrahimov
- Ayan Islam

## Project Overview
This project is a full-stack WIAL directory and enrollment platform built during the 2026 Spring WiCS ASU hackathon. It includes:

- A Next.js frontend for browsing chapters, coaches, events, and certification programs
- A Go backend API for serving directory and auth data
- A Postgres database for application data
- Stripe-powered checkout flows in the frontend

## Tech Stack
- Frontend: Next.js 16, React 19, TypeScript
- Backend: Go, Gin
- Database: PostgreSQL
- APIs: REST API, Stripe

## Getting Started
```bash
git clone https://github.com/2026-ASU-WiCS-Opportunity-Hack/28-shawarmaalgo.git
cd 28-shawarmaalgo
```

### Environment setup
Use the committed template at [`.env.example`](/Users/beybutabdulrahimov/Documents/28-shawarmaalgo/.env.example) as the source of truth for local configuration.

- Copy the backend variables into `backend/.env`
- Copy the frontend variables into `frontend/.env.local`

### Run the backend
```bash
cd backend
go run ./cmd/server
```

The API runs on `http://localhost:8080` by default and exposes routes under `/api/v1`.

### Run the frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` by default.

### Database
The backend expects PostgreSQL. The default local connection string in the example file is:

```bash
postgres://postgres:postgres@localhost:5432/wial?sslmode=disable
```

Run migrations from the `backend` directory with `golang-migrate` installed:

```bash
migrate -path ./migrations -database "$DATABASE_URL" up
```

## Checklist for the final submission
### 0/Judging Criteria
- [ ] Review the [judging criteria](https://www.ohack.dev/about/judges#judging-criteria)

### 1/DevPost
- [ ] Submit a [DevPost project](https://wics-ohack-sp26-hackathon.devpost.com/)
- [ ] Demo video should be 4 minutes or less
- [ ] Link your team on ohack.dev in [your team dashboard](https://www.ohack.dev/hack/2026_spring_wics_asu/manageteam)
- [ ] Link your GitHub repo on DevPost under "Try it out"

### 2/GitHub
- [ ] Add everyone on your team to your GitHub repo
- [ ] Make sure your repo is public
- [ ] Make sure your repo has a MIT License
- [ ] Make sure your repo has a detailed README.md
