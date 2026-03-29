# Backend handoff

This frontend is built as a production-ready public site plus authenticated portal shells for global admins, chapter leaders, and coaches.

## Core product areas
- Public WIAL pages
- Chapter pages
- Authentication and session
- Role-based portal access
- Chapter content editing
- Coach profile management
- Events and resources
- Contact routing

## Data structure to support

### 1. Users
Use one user model for all authenticated access.

Suggested fields:
- id
- first_name
- last_name
- email
- password_hash or external_auth_id
- status
- last_login_at
- created_at
- updated_at

### 2. Roles
Suggested values:
- global_admin
- chapter_leader
- coach

Suggested fields:
- id
- key
- label

### 3. User role assignments
Needed because one person may have multiple permissions.

Suggested fields:
- id
- user_id
- role_id
- chapter_id (nullable when the role is global)
- created_at

### 4. Pages
Use for global managed content such as home, about, action-learning, certification, resources, and contact.

Suggested fields:
- id
- slug
- title
- hero_eyebrow
- hero_title
- hero_description
- sections_json
- seo_title
- seo_description
- status
- updated_at

### 5. Chapters
User-facing label is "chapters".

Suggested fields:
- id
- slug
- name
- short_name
- status
- hero_eyebrow
- hero_title
- hero_description
- overview
- email
- phone
- city
- country_code
- primary_language
- logo_url
- sort_order
- updated_at

### 6. Chapter team members
Suggested fields:
- id
- chapter_id
- name
- role
- blurb
- photo_url
- sort_order
- status

### 7. Coaches
Suggested fields:
- id
- chapter_id
- user_id (nullable if profile exists before account creation)
- name
- certification_level
- location
- focus
- bio
- email
- photo_url
- profile_slug
- visibility_status
- approved_at
- updated_at

### 8. Certifications
Suggested fields:
- id
- coach_id
- level
- issued_at
- expires_at
- status
- badge_url

### 9. Events
Suggested fields:
- id
- chapter_id (nullable for global events)
- scope (global or chapter)
- title
- summary
- description
- start_at
- end_at
- location
- registration_url
- status
- updated_at

### 10. Resources
Suggested fields:
- id
- chapter_id (nullable for global resources)
- title
- type
- summary
- body_or_url
- status
- updated_at

### 11. Testimonials
Suggested fields:
- id
- chapter_id (nullable for global testimonials)
- quote
- name
- role
- organization
- status

### 12. Contact submissions
Suggested fields:
- id
- scope (global or chapter)
- chapter_id (nullable)
- name
- email
- subject
- message
- routed_to
- status
- created_at

## Endpoint groups the frontend now expects

### Public content
- GET /api/pages/home
- GET /api/pages/about
- GET /api/pages/action-learning
- GET /api/pages/certification
- GET /api/pages/resources
- GET /api/pages/contact

### Public chapters
- GET /api/chapters
- GET /api/chapters/:slug
- GET /api/chapters/:slug/team
- GET /api/chapters/:slug/coaches
- GET /api/chapters/:slug/events
- GET /api/chapters/:slug/resources
- GET /api/chapters/:slug/testimonials
- POST /api/chapters/:slug/contact

### Public listings
- GET /api/coaches
- GET /api/events
- GET /api/resources

Useful query params:
- /api/coaches?q=&chapter=&certification=
- /api/events?scope=global|chapter&chapter=
- /api/resources?chapter=&type=

### Authentication and session
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/session
- GET /api/me

### Coach account
- GET /api/me/coach-profile
- PATCH /api/me/coach-profile
- GET /api/me/certification

### Portal overview
- GET /api/portal/overview
- GET /api/portal/approvals

### Chapter leader content management
- GET /api/portal/chapters/:slug
- PATCH /api/portal/chapters/:slug/content
- PATCH /api/portal/chapters/:slug/contact
- POST /api/portal/chapters/:slug/events
- PATCH /api/portal/chapters/:slug/events/:eventId
- POST /api/portal/chapters/:slug/resources
- PATCH /api/portal/chapters/:slug/resources/:resourceId

### Global content management
- PATCH /api/portal/pages/:slug

## What the frontend is doing already
- Public pages render from seeded data now, but are structured to accept CMS or API content.
- Chapter routes are already organized for structured content by slug.
- Login, role preview, portal, and chapter editing screens are in place.
- Contact and chapter inquiry forms are ready for POST integration.

## Suggested implementation order
1. auth and session
2. chapters
3. coaches
4. events
5. pages
6. resources
7. portal editing
8. contact routing
