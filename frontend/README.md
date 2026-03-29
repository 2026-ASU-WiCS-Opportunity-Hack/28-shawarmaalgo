# WIAL frontend

A production-ready frontend for the World Institute for Action Learning built with Next.js, TypeScript, and Tailwind CSS.

## Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Static-first public routes with placeholder API integration

## Included routes
### Public pages
- /
- /about
- /action-learning
- /certification
- /coaches
- /resources
- /events
- /chapters
- /contact

### Chapter pages
- /[country]
- /[country]/team
- /[country]/coaches
- /[country]/events
- /[country]/resources
- /[country]/contact

### Auth and portal pages
- /login
- /portal
- /portal/chapters/[country]/content

## Quick start
```bash
npm install
npm run dev
```

Open:
```bash
http://localhost:3000
```

## Environment
Create `.env.local` from `.env.example` and set:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

## Frontend structure
- `app/` contains routes
- `components/` contains shared layout, card, and section components
- `data/` contains seeded content and chapter records
- `lib/api.ts` contains placeholder API helpers
- `docs/BACKEND_HANDOFF.md` contains the backend handoff structure

## Endpoints the frontend is prepared for

### Public content
- GET `/api/pages/home`
- GET `/api/pages/about`
- GET `/api/pages/action-learning`
- GET `/api/pages/certification`
- GET `/api/pages/resources`
- GET `/api/pages/contact`

### Public chapters
- GET `/api/chapters`
- GET `/api/chapters/:slug`
- GET `/api/chapters/:slug/team`
- GET `/api/chapters/:slug/coaches`
- GET `/api/chapters/:slug/events`
- GET `/api/chapters/:slug/resources`
- GET `/api/chapters/:slug/testimonials`
- POST `/api/chapters/:slug/contact`

### Public listings
- GET `/api/coaches?q=&chapter=&certification=`
- GET `/api/events?scope=global|chapter&chapter=`
- GET `/api/resources?chapter=&type=`

### Auth and session
- POST `/api/auth/login`
- POST `/api/auth/logout`
- GET `/api/auth/session`
- GET `/api/me`

### Coach account
- GET `/api/me/coach-profile`
- PATCH `/api/me/coach-profile`
- GET `/api/me/certification`

### Chapter leader content editing
- GET `/api/portal/chapters/:slug`
- PATCH `/api/portal/chapters/:slug/content`
- PATCH `/api/portal/chapters/:slug/contact`
- POST `/api/portal/chapters/:slug/events`
- PATCH `/api/portal/chapters/:slug/events/:eventId`
- POST `/api/portal/chapters/:slug/resources`
- PATCH `/api/portal/chapters/:slug/resources/:resourceId`

### Global admin editing
- GET `/api/portal/overview`
- GET `/api/portal/approvals`
- PATCH `/api/portal/pages/:slug`

## Notes for your backend teammate
No backend implementation is included here. The public site, login flow, portal shells, and chapter content workspace are already in place so your backend teammate can connect real auth, session, profile, and content APIs without changing the route architecture.
