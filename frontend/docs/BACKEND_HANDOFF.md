# Backend handoff

## What the frontend already includes
- public WIAL pages
- public chapter pages
- login page
- admin console
- chapter leader console
- coach account console
- admin chapter creation flow
- admin chapter settings flow
- chapter editing views for content, team, coaches, events, resources, and contact

## Recommended backend priorities
1. Auth and session
2. Public chapter endpoints
3. Chapter leader content endpoints
4. Admin chapter creation and management endpoints
5. Coach account endpoints
6. Global page editing endpoints

## Required endpoint groups

### Auth
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`

### Public
- `GET /api/pages/:slug`
- `GET /api/chapters`
- `GET /api/chapters/:slug`
- `GET /api/chapters/:slug/team`
- `GET /api/chapters/:slug/coaches`
- `GET /api/chapters/:slug/events`
- `GET /api/chapters/:slug/resources`
- `GET /api/chapters/:slug/testimonials`
- `POST /api/chapters/:slug/contact`
- `GET /api/coaches`
- `GET /api/events`
- `GET /api/resources`

### Coach account
- `GET /api/me/coach-profile`
- `PATCH /api/me/coach-profile`
- `GET /api/me/certification`

### Chapter leader console
- `GET /api/portal/chapters/:slug`
- `PATCH /api/portal/chapters/:slug/content`
- `PATCH /api/portal/chapters/:slug/contact`
- `PATCH /api/portal/chapters/:slug/team/:memberId`
- `POST /api/portal/chapters/:slug/coaches`
- `PATCH /api/portal/chapters/:slug/coaches/:coachId`
- `DELETE /api/portal/chapters/:slug/coaches/:coachId`
- `POST /api/portal/chapters/:slug/events`
- `PATCH /api/portal/chapters/:slug/events/:eventId`
- `DELETE /api/portal/chapters/:slug/events/:eventId`
- `POST /api/portal/chapters/:slug/resources`
- `PATCH /api/portal/chapters/:slug/resources/:resourceId`
- `DELETE /api/portal/chapters/:slug/resources/:resourceId`

### Admin console
- `GET /api/portal/overview`
- `GET /api/portal/chapters`
- `POST /api/portal/chapters`
- `GET /api/portal/chapters/:slug`
- `PATCH /api/portal/chapters/:slug`
- `POST /api/portal/chapters/:slug/assign-leader`
- `GET /api/portal/pages`
- `PATCH /api/portal/pages/:slug`
- `GET /api/portal/users`

## Provisioning flow for a new chapter
When an admin creates a new chapter, the backend should:
1. create the chapter record
2. seed default content blocks
3. create default relations for team, coaches, events, and resources
4. assign the chapter leader if one is provided
5. make the public route available at `/:slug`

Example: creating `WIAL Canada` with slug `canada` should make `/canada` available once the chapter is published.

## SSR guidance
This frontend is ready for server-side rendering.
- public pages can use server-side `fetch()` with `revalidate`
- portal routes should stay dynamic with `cache: 'no-store'`
- authenticated pages should rely on session-aware server requests
