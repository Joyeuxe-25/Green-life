# Phase 15: Final QA, Preview Setup, And Deployment Readiness

## Summary

Phase 15 checked the Green Life Rwanda monorepo after removal of the old static site and prepared the QA and preview deployment notes for the Next.js public site, Next.js admin site, and Cloudflare API.

No new features were added. No public-site redesign work was done. No admin CRUD, API, database, R2, or authentication logic was changed.

## Files Checked

Required workspace structure:

- `apps/public-site`
- `apps/admin-site`
- `apps/api`
- `packages/shared`
- `docs`

Environment/config examples:

- `apps/api/.dev.vars.example`
- `apps/public-site/.env.local.example`
- `apps/admin-site/.env.local.example`
- `apps/api/wrangler.jsonc`
- `.gitignore`

Package scripts:

- root `package.json`
- `apps/api/package.json`
- `apps/public-site/package.json`
- `apps/admin-site/package.json`

## Files Changed

- `.gitignore`
  - Fixed `cookies.text` to `cookies.txt` so the local cookie jar is ignored.
- `docs/PHASE_15_FINAL_QA_AND_PREVIEW_SETUP_REPORT.md`
  - Added this readiness report.

## Commands Run

```powershell
pnpm --recursive typecheck
```

The first sandboxed run failed with `fetch failed`. The same command passed after rerunning with approval.

## Typecheck Result

Passed for:

- `apps/admin-site`
- `apps/api`
- `apps/public-site`
- `packages/shared`

## Local Run Commands

API:

```powershell
pnpm --filter api dev
```

Public site:

```powershell
pnpm --filter public-site dev
```

Admin site:

```powershell
pnpm --filter admin-site dev
```

Root script aliases are also available:

```powershell
pnpm dev:api
pnpm dev:public
pnpm dev:admin
```

## Environment Review

`apps/public-site/.env.local.example`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8787
```

`apps/admin-site/.env.local.example`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8787
```

`apps/api/.dev.vars.example` includes placeholder-only values for:

- `ENABLE_ADMIN_SETUP`
- `ADMIN_SETUP_SECRET`
- `ADMIN_SESSION_SECRET`
- `ADMIN_SESSION_COOKIE_NAME`
- `ADMIN_SESSION_EXPIRES_DAYS`
- `CORS_ALLOWED_ORIGINS`
- `R2_PUBLIC_BASE_URL`

`apps/api/wrangler.jsonc` includes:

- D1 binding: `DATABASE`
- R2 binding: `MEDIA_BUCKET`
- Placeholder D1 database ID: `REPLACE_WITH_D1_DATABASE_ID`
- Media public base URL variable: `R2_PUBLIC_BASE_URL`

No real secrets were found in the reviewed example files.

## Required Environment Variables

Public and admin preview deployments:

- `NEXT_PUBLIC_API_BASE_URL`

API local/preview/production:

- `ENABLE_ADMIN_SETUP`
- `ADMIN_SETUP_SECRET`
- `ADMIN_SESSION_SECRET`
- `ADMIN_SESSION_COOKIE_NAME`
- `ADMIN_SESSION_EXPIRES_DAYS`
- `CORS_ALLOWED_ORIGINS`
- `R2_PUBLIC_BASE_URL`

API Cloudflare bindings:

- D1 binding: `DATABASE`
- R2 binding: `MEDIA_BUCKET`

For preview URLs, update `CORS_ALLOWED_ORIGINS` to include the Vercel public-site and admin-site preview domains.

## Admin QA Checklist

- Login works with cookie auth.
- Logout clears admin session.
- Change password works.
- News CRUD: create, list, edit, delete.
- Events CRUD: create, list, edit, delete.
- Projects CRUD: create, list, edit, delete.
- Staff CRUD: create, list, edit, delete.
- Partners CRUD: create, list, edit, delete.
- Contact messages list/detail/delete works.
- Donation messages list/detail/delete works.
- Site content CRUD works.
- Programs CRUD works.
- Impact stats CRUD works.
- Site settings CRUD works.
- Media library upload/list/edit/delete works.
- Admin pages reject unauthenticated users.
- Forms show loading, error, empty, and validation states where applicable.

## Public Website QA Checklist

- Homepage renders dynamic content from the public API.
- About page renders dynamic content from the public API.
- Programs page renders dynamic programs/content.
- Projects page renders dynamic project list.
- Project details page works for valid slugs and handles missing slugs.
- Impact page renders dynamic impact stats/content.
- News page renders dynamic news list.
- News details page works for valid slugs and handles missing slugs.
- Events page renders dynamic event list.
- Event details page works for valid slugs and handles missing slugs.
- Staff page renders dynamic staff only.
- Partners page renders dynamic partners only.
- Donate page renders dynamic content.
- Contact page renders dynamic content.
- Get involved page renders dynamic content.
- No Reports link appears in public navigation.
- No banned image is displayed.
- No staff members are hardcoded.
- No removed root static HTML file is required.
- Empty states render when API data is missing.
- Responsive layout works on mobile, tablet, and desktop widths.
- Media images load from API/R2 URLs rather than local hardcoded public assets.

## Preview Deployment Plan

Recommended temporary preview:

- Deploy `apps/public-site` to Vercel.
- Deploy `apps/admin-site` to Vercel.
- Run/deploy `apps/api` through Cloudflare Workers with D1 and R2 configured.

Preview env setup:

- Set `NEXT_PUBLIC_API_BASE_URL` in both Vercel projects to the preview API URL.
- Set API `CORS_ALLOWED_ORIGINS` to include both Vercel preview URLs.
- Keep admin setup/session secrets in Cloudflare secrets or environment configuration, not in source files.
- Confirm D1 migrations are applied to the preview D1 database before testing admin/public data.
- Confirm R2 bucket and `R2_PUBLIC_BASE_URL` are configured before testing media URLs.

Do not deploy automatically in this phase.

## Final Cloudflare Deployment Plan

Production target:

- Cloudflare Workers for `apps/api`.
- Cloudflare D1 for the database.
- Cloudflare R2 for media.
- Cloudflare Pages or equivalent Cloudflare hosting for `apps/public-site`.
- Cloudflare Pages or equivalent Cloudflare hosting for `apps/admin-site`.

Production setup requirements:

- Replace `REPLACE_WITH_D1_DATABASE_ID` in deployment config with the real D1 database ID.
- Configure the production R2 bucket for `MEDIA_BUCKET`.
- Configure `R2_PUBLIC_BASE_URL`.
- Configure production `CORS_ALLOWED_ORIGINS`.
- Configure secure admin setup/session secrets.
- Apply migrations intentionally to the target D1 environment.
- Verify public API endpoints before switching DNS.

## Git Safety

These files/folders must not be committed:

- `00_INPUTS/`
- `cookies.txt`
- `apps/api/.dev.vars`
- `apps/admin-site/.env.local`
- `apps/public-site/.env.local`
- any real secrets, passwords, tokens, or production database IDs

`.gitignore` now ignores `cookies.txt` along with local env/input/build artifacts.

## Known Issues And Risks

- Local browser QA was not performed in this phase; the report provides checklists and commands for human verification.
- D1 migrations and live data state were not changed or verified against a running database in this phase.
- R2 upload was not retested in this phase.
- Preview CORS must be updated whenever Vercel preview URLs change.
- `apps/api/wrangler.jsonc` still contains a placeholder D1 database ID and must be configured for real deployment.
- Local `apps/api/.dev.vars` and `apps/admin-site/.env.local` exist on disk and should remain uncommitted.

## Recommended Next Phase

Proceed to preview deployment setup:

- Configure preview API, D1, and R2.
- Deploy public and admin Next.js apps to preview environments.
- Run the admin and public QA checklists against preview URLs.
- Fix only deployment-blocking configuration issues before production readiness review.
