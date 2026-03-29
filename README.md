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
- Frontend: React.js, Tailwind CSS
- Backend: Go
- Database: Supabase
- APIs:

## Getting Started
```bash
git clone https://github.com/2026-ASU-WiCS-Opportunity-Hack/28-shawarmaalgo.git
cd 28-shawarmaalgo
docker compose up -d
```

The frontend is available at `http://localhost:3000`, the backend at `http://localhost:8080`, and Postgres at `localhost:5432`.
The local Postgres instance starts on `localhost:5432` with database `wial`, username `postgres`, and password `postgres`.
The backend bootstrap flow also requires `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` on first launch; the compose file now provides development defaults.

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
