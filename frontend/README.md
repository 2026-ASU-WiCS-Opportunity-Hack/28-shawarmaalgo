# WIAL frontend

A production-ready frontend for the World Institute for Action Learning built with Next.js, TypeScript, and Tailwind CSS.

## Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Server components for public pages and management consoles
- Structured placeholder API integration in `lib/api.ts`

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

### Account and portal pages
- /login
- /portal
- /portal/admin
- /portal/admin/chapters
- /portal/admin/chapters/new
- /portal/admin/chapters/[slug]
- /portal/admin/pages
- /portal/admin/users
- /portal/chapter
- /portal/chapter/[country]/content
- /portal/chapter/[country]/team
- /portal/chapter/[country]/coaches
- /portal/chapter/[country]/events
- /portal/chapter/[country]/resources
- /portal/chapter/[country]/contact
- /portal/coach

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
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

## Frontend structure
- `app/` contains routes
- `components/` contains shared layout, cards, sections, and portal UI
- `data/` contains seeded content and mock records
- `lib/api.ts` contains placeholder API helpers
- `lib/server-data.ts` contains async server-side mock data loaders
- `docs/BACKEND_HANDOFF.md` mirrors the backend contract

## Rendering approach

### Public pages
Public routes are built with Next.js server components. They can stay static-first, or you can fetch page, chapter, event, and resource data from your backend on the server.

Recommended production approach:
- keep public marketing pages cached with `revalidate`
- fetch chapter content on the server
- fetch listings on the server for SEO and initial performance

### Portal routes
Portal routes are already set to dynamic rendering with:
```ts
export const dynamic = 'force-dynamic'
```
Use that for authenticated, role-based pages where content changes frequently.

### If you want full SSR everywhere
Use server-side `fetch()` in page files and keep `cache: 'no-store'` for authenticated or rapidly changing content. In App Router, that is enough to make the route render on the server per request.

## Endpoint contract
These are the backend endpoints this frontend is designed to connect to.

### Auth and session
#### `POST /api/auth/login`
Purpose: sign a user in.

Send:
- `email`
- `password`

Return:
- authenticated user object
- role (`admin`, `chapter-leader`, `coach`)
- session token or cookie-based session confirmation
- chapter assignment if relevant

#### `POST /api/auth/logout`
Purpose: end the current session.

#### `GET /api/auth/session`
Purpose: return the current authenticated session.

Return:
- `isAuthenticated`
- `user.id`
- `user.name`
- `user.email`
- `user.role`
- `user.chapterSlug` if applicable

### Public content pages
#### `GET /api/pages/:slug`
Purpose: return shared content for editable global pages.

Supported slugs used by this frontend:
- `home`
- `about`
- `action-learning`
- `certification`
- `resources`
- `contact`

Return shape:
- `title`
- `hero`
- `sections[]`
- optional `cta`

### Public chapters
#### `GET /api/chapters`
Purpose: list all chapters for `/chapters`, navigation, and admin selection.

Each chapter should include:
- `id`
- `name`
- `slug`
- `country`
- `contact`
- `hero`
- `status`

#### `GET /api/chapters/:slug`
Purpose: return the public chapter homepage data.

Return:
- `slug`
- `name`
- `hero`
- `overview`
- `contact`
- featured content summaries

#### `GET /api/chapters/:slug/team`
Purpose: return team and leadership content for a chapter.

#### `GET /api/chapters/:slug/coaches`
Purpose: return coach cards for a chapter.

#### `GET /api/chapters/:slug/events`
Purpose: return chapter-specific events.

#### `GET /api/chapters/:slug/resources`
Purpose: return chapter-specific resources.

#### `GET /api/chapters/:slug/testimonials`
Purpose: return chapter testimonials.

#### `POST /api/chapters/:slug/contact`
Purpose: submit chapter contact form entries.

Send:
- `name`
- `email`
- `message`

### Public listings
#### `GET /api/coaches?q=&chapter=&certification=`
Purpose: global coach directory with filters.

Query params expected by frontend:
- `q`
- `chapter`
- `certification`

#### `GET /api/events?scope=global|chapter&chapter=`
Purpose: global and chapter events listing.

#### `GET /api/resources?chapter=&type=`
Purpose: global and chapter resources listing.

### Coach account
#### `GET /api/me/coach-profile`
Purpose: return the current coach profile for `/portal/coach`.

#### `PATCH /api/me/coach-profile`
Purpose: update the current coach profile.

Send:
- `name`
- `location`
- `bio`
- `specialties`
- optional profile media fields

#### `GET /api/me/certification`
Purpose: return certification status, credits, and renewal information.

### Chapter leader console
#### `GET /api/portal/chapters/:slug`
Purpose: return the chapter management workspace for a specific chapter.

Return should combine:
- chapter settings
- content fields
- team
- coaches
- events
- resources
- contact

#### `PATCH /api/portal/chapters/:slug/content`
Purpose: update chapter homepage content.

Send:
- `hero`
- `overview`
- featured content references

#### `PATCH /api/portal/chapters/:slug/contact`
Purpose: update chapter contact information.

#### `PATCH /api/portal/chapters/:slug/team/:memberId`
Purpose: update a single team member entry.

#### `POST /api/portal/chapters/:slug/coaches`
Purpose: create a chapter coach record.

#### `PATCH /api/portal/chapters/:slug/coaches/:coachId`
Purpose: update a chapter coach record.

#### `DELETE /api/portal/chapters/:slug/coaches/:coachId`
Purpose: archive or remove a coach from the chapter workspace.

#### `POST /api/portal/chapters/:slug/events`
Purpose: create a chapter event.

#### `PATCH /api/portal/chapters/:slug/events/:eventId`
Purpose: update a chapter event.

#### `DELETE /api/portal/chapters/:slug/events/:eventId`
Purpose: delete or archive a chapter event.

#### `POST /api/portal/chapters/:slug/resources`
Purpose: create a chapter resource.

#### `PATCH /api/portal/chapters/:slug/resources/:resourceId`
Purpose: update a chapter resource.

#### `DELETE /api/portal/chapters/:slug/resources/:resourceId`
Purpose: delete or archive a chapter resource.

### Admin console
#### `GET /api/portal/overview`
Purpose: high-level stats for the admin dashboard.

Suggested return:
- `chapters`
- `activeCoaches`
- `upcomingEvents`
- `pendingApprovals`
- `pageUpdates`
- `chapterLeaders`

#### `GET /api/portal/chapters`
Purpose: list all chapters in the admin console.

#### `POST /api/portal/chapters`
Purpose: create a new chapter from the shared template.

Send:
- `name`
- `slug`
- `country`
- `primaryLanguage`
- `contactEmail`
- `leaderEmail`
- `hero`
- optional `status`

Expected backend behavior:
- create the chapter record
- seed default content sections
- assign the chapter leader if provided
- make the new public route available at `/:slug`

#### `GET /api/portal/chapters/:slug`
Purpose: return one chapter for admin editing.

#### `PATCH /api/portal/chapters/:slug`
Purpose: update chapter settings.

#### `POST /api/portal/chapters/:slug/assign-leader`
Purpose: assign or replace a chapter leader.

#### `GET /api/portal/pages`
Purpose: return editable global pages list.

#### `PATCH /api/portal/pages/:slug`
Purpose: update a shared global page.

#### `GET /api/portal/users`
Purpose: return user and role management data for admins.

## Suggested backend entities
Your backend teammate should plan for these core entities:
- `users`
- `chapters`
- `chapter_content`
- `chapter_team_members`
- `coaches`
- `events`
- `resources`
- `testimonials`
- `contact_submissions`
- `sessions` or auth provider-backed session storage

## Notes
- Public routes are ready for server-side fetching.
- Portal routes are already organized by role.
- Chapter creation is represented in the admin console UI.
- Chapter leaders already have dedicated screens for content, team, coaches, events, resources, and contact editing.
- Coach accounts already have profile and certification views.
