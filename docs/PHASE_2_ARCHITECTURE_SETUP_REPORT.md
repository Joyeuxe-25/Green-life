# Phase 2 Architecture Setup Report

Date: 2026-06-06

Scope: new architecture setup only. No full features, database schema, CRUD endpoints, R2 upload logic, public page rebuild, package installation, deletion, or commit was performed.

## Folders Created

- `apps/public-site`
- `apps/public-site/app`
- `apps/public-site/components`
- `apps/public-site/lib`
- `apps/public-site/content`
- `apps/public-site/public`
- `apps/admin-site`
- `apps/admin-site/app`
- `apps/admin-site/components`
- `apps/admin-site/lib`
- `apps/admin-site/public`
- `apps/api`
- `apps/api/src`
- `packages/shared`
- `packages/shared/src`
- `docs`

## Root Workspace Files Created

- `package.json`
- `pnpm-workspace.yaml`
- `tsconfig.base.json`
- `.gitignore`

The root `README.md` from the old static site was left untouched.

## Package / Workspace Structure

The monorepo is organized as:

```text
green-life-rwanda/
  apps/
    public-site/
    admin-site/
    api/
  packages/
    shared/
  docs/
```

The workspace file includes:

- `apps/*`
- `packages/*`

The root package scripts point to future human-run commands for each workspace package. Dependencies are listed in package manifests only; they were not installed.

## Public Site Skeleton

Created minimal Next.js TypeScript placeholder structure:

- `apps/public-site/package.json`
- `apps/public-site/tsconfig.json`
- `apps/public-site/next.config.ts`
- `apps/public-site/app/layout.tsx`
- `apps/public-site/app/page.tsx`
- `apps/public-site/app/globals.css`
- `apps/public-site/components/`
- `apps/public-site/lib/`
- `apps/public-site/content/`
- `apps/public-site/public/`

The placeholder homepage only identifies the future Green Life Rwanda public website. No real public pages were rebuilt.

## Admin Site Skeleton

Created minimal Next.js TypeScript placeholder structure:

- `apps/admin-site/package.json`
- `apps/admin-site/tsconfig.json`
- `apps/admin-site/next.config.ts`
- `apps/admin-site/app/layout.tsx`
- `apps/admin-site/app/page.tsx`
- `apps/admin-site/app/globals.css`
- `apps/admin-site/components/`
- `apps/admin-site/lib/`
- `apps/admin-site/public/`

The placeholder admin page displays only:

- `Green Life Rwanda Admin`

No login, sidebar, dashboard, or CRUD screens were built.

## API Skeleton

Created minimal Hono Cloudflare Workers structure:

- `apps/api/package.json`
- `apps/api/tsconfig.json`
- `apps/api/wrangler.jsonc`
- `apps/api/src/index.ts`
- `apps/api/src/types.ts`

Placeholder routes only:

- `GET /`
- `GET /health`

No real API endpoints, D1 schema, migrations, or R2 upload logic were created.

## Shared Package Skeleton

Created minimal TypeScript shared package:

- `packages/shared/package.json`
- `packages/shared/tsconfig.json`
- `packages/shared/src/index.ts`
- `packages/shared/src/constants.ts`
- `packages/shared/src/types.ts`

Included basic constants and TypeScript types for:

- News
- Events
- Projects
- Staff
- Partners
- Media
- Contact messages
- Donation messages

No validation layer, Zod schemas, or business logic were added.

## Environment Variables Plan

Created:

- `docs/ENVIRONMENT_VARIABLES_PLAN.md`

Planned variables/bindings documented:

- `DATABASE`
- `MEDIA_BUCKET`
- `ADMIN_SESSION_SECRET`
- `ADMIN_SESSION_COOKIE_NAME`
- `ADMIN_SESSION_EXPIRES_DAYS`
- `PUBLIC_SITE_URL`
- `ADMIN_SITE_URL`
- `CORS_ALLOWED_ORIGINS`
- `COOKIE_DOMAIN`
- `NEXT_PUBLIC_API_URL`

No real secrets were created.

## Admin Authentication Decision

Admin authentication is locked to secure HTTP-only cookies. It will not use `localStorage` token storage.

Planned behavior:

- Admin login will be handled by the Hono/Cloudflare Workers API.
- On successful login, the API will set an HTTP-only session cookie.
- Recommended cookie name: `glr_admin_session`.
- The admin Next.js site will send authenticated API requests with credentials included.
- The API will validate the session from the cookie.
- Logout will clear the cookie.
- Change password will require a valid session cookie.

Planned production cookie settings:

- `httpOnly: true`
- `secure: true`
- `sameSite: Lax`
- `path: /`

Clarifications:

- Do not store admin session tokens in `localStorage`.
- Do not expose session secrets to the frontend.
- The public website does not need admin cookies.
- Admin cookies are only for the admin website/API authentication flow.

## Locked Decisions Preserved

- Public website: Next.js + TypeScript + shadcn/ui later.
- Admin website: separate Next.js + TypeScript + shadcn/ui later.
- API: Hono on Cloudflare Workers.
- Database: Cloudflare D1 later.
- Media storage: Cloudflare R2 later.
- One admin user only.
- Admin authentication will use secure HTTP-only cookies.
- One shared `media_files` table later.
- No reports feature.
- No activity logs.
- `reports.html` remains untouched but excluded from future rebuild scope.
- Restore Local remains text-only until a logo is provided.
- Partner spelling set to Biocoor.
- FMI Ubumuntu used as the preferred spelling.
- `excluded legacy team meeting image` was not used anywhere in the new skeleton.

## Commands For Human To Run Later

Do not run these until package installation is approved:

```bash
pnpm install
pnpm --filter public-site dev
pnpm --filter admin-site dev
pnpm --filter api dev
pnpm --filter shared build
```

Additional setup commands may be needed later for shadcn/ui, Cloudflare D1, Cloudflare R2, and deployment configuration. Those were intentionally not run in Phase 2.

## Warnings

- No dependencies were installed, so type checks and dev servers were not run.
- `wrangler.jsonc` contains placeholder D1/R2 binding IDs and names that must be replaced later.
- The old static website remains at the repository root as reference and fallback.
- `reports.html` still exists in the old static site and should not be included in the future rebuild.
- The missing Restore Local logo still needs to be supplied.
- No real secrets should be committed to the repository.

## Recommended Next Phase

Phase 3 should prepare the implementation blueprint before feature build-out:

- Confirm package installation approval.
- Install dependencies when approved.
- Initialize shadcn/ui separately for public and admin apps.
- Add lint/typecheck tooling.
- Plan public routes and content components.
- Plan admin auth shell and sidebar.
- Plan API route groups without creating full CRUD until approved.
- Plan D1 schema/migrations and R2 media flow in a dedicated backend phase.

Stop here until Phase 3 is explicitly approved.
