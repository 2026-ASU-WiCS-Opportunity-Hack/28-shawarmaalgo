# Fixes Applied

## Deployment
- Upgraded the frontend `next` dependency from `14.2.15` to `14.2.35`.
- Removed the stale frontend `package-lock.json` so Railway can install a fresh, non-vulnerable dependency tree.
- Updated the frontend Dockerfile to work with or without a lockfile.
- Removed the duplicate `next.config.mjs` so the app uses a single Next config source.

## Coaches directory
- Replaced the static coaches search UI with a working client-side directory filter.
- Search now filters by name, certification, chapter, location, focus, and bio.
- Added a reset control and result counts.

## Chapter portal
- Improved chapter portal access controls so chapter-specific management pages redirect to the signed-in chapter instead of exposing other chapter slugs.
- Content creators are redirected to their chapter content editor instead of the broader chapter workspace.

## Coach editing
- Expanded chapter coach editing to support phone, profile image URL, LinkedIn URL, and website URL.
- Fixed coach profile updates so clearing optional fields persists correctly instead of being ignored.
- Added stronger validation and draft cleanup after deletes.
- Applied the same optional-field clearing fix to the coach self-service profile editor.

## Packaging cleanup
- The updated delivery zip excludes `.git`, `.idea`, `node_modules`, `.DS_Store`, and other local-machine artifacts.

- Replaced unsupported `frontend/next.config.ts` with `frontend/next.config.mjs` so production Docker/Next builds succeed.
