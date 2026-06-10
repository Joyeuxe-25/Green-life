# Phase 8C First Admin Setup Report

## Scope

Phase 8C created a backend-only, guarded first-admin setup path. No frontend UI, admin forms, CRUD modules, R2 upload logic, public content migration, remote D1 migration, or database schema change was started.

## Files Changed

- `apps/api/src/types.ts`
- `apps/api/src/db/admin.ts`
- `apps/api/src/routes/admin-setup.ts`
- `apps/api/src/index.ts`
- `apps/api/.dev.vars.example`
- `docs/ENVIRONMENT_VARIABLES_PLAN.md`
- `docs/PHASE_8C_FIRST_ADMIN_SETUP_REPORT.md`

## Setup Route Added

Route:

```text
POST /admin/setup/first-admin
```

Behavior:

- Returns `404` while `ENABLE_ADMIN_SETUP` is not exactly `true`.
- Requires the `x-admin-setup-secret` request header.
- Compares the header value against `ADMIN_SETUP_SECRET`.
- Rejects setup when an active admin already exists.
- Accepts `name`, `email`, `password`, and `confirmPassword`.
- Validates required fields, basic email shape, matching password confirmation, and password strength.
- Hashes the password using the existing PBKDF2-SHA256 helper.
- Inserts exactly one active admin record into the existing `admin` table.
- Returns safe admin fields only: `id`, `name`, and `email`.
- Does not return `password_hash`.
- Does not return the setup secret.
- Does not automatically set a session cookie.

## Required Environment Variables

- `ENABLE_ADMIN_SETUP`: must equal `true` during controlled setup only.
- `ADMIN_SETUP_SECRET`: strong private setup secret checked through `x-admin-setup-secret`.
- `ADMIN_SESSION_SECRET`: still required for normal cookie auth login after setup.
- `ADMIN_SESSION_COOKIE_NAME`: recommended value `glr_admin_session`.
- `ADMIN_SESSION_EXPIRES_DAYS`: recommended local value `7`.
- `CORS_ALLOWED_ORIGINS`: approved admin/public origins for browser requests.

`apps/api/.dev.vars.example` was added with placeholder values only. No real `.dev.vars` file or secret values were created.

## Database Helpers Added

Minimal helpers were added to `apps/api/src/db/admin.ts`:

- `countActiveAdmins()`
- `createAdmin()`

These helpers support first-admin setup only. They do not implement general admin user management.

## Security Rules

- This route is not public registration.
- The project remains one-admin-only for now.
- Setup is disabled by default unless `ENABLE_ADMIN_SETUP=true`.
- `ADMIN_SETUP_SECRET` must be strong, private, and never committed.
- Disable setup immediately after creating the first admin.
- Use Wrangler secrets or the Cloudflare dashboard for production secrets.
- Do not expose setup or session secrets to any frontend app.
- Admin authentication continues to use secure HTTP-only cookies, not `localStorage`.

## Local Testing Commands

Start the API:

```powershell
pnpm --filter api dev
```

Create the first admin locally with placeholder values:

```powershell
curl.exe -X POST http://localhost:8787/admin/setup/first-admin ^
  -H "Content-Type: application/json" ^
  -H "x-admin-setup-secret: YOUR_LOCAL_SETUP_SECRET" ^
  -d "{\"name\":\"Green Life Admin\",\"email\":\"admin@example.com\",\"password\":\"ChangeThisStrongPassword123!\",\"confirmPassword\":\"ChangeThisStrongPassword123!\"}"
```

Then test login:

```powershell
curl.exe -i -X POST http://localhost:8787/admin/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@example.com\",\"password\":\"ChangeThisStrongPassword123!\"}"
```

Typecheck:

```powershell
pnpm --filter api typecheck
pnpm --recursive typecheck
```

## How to Disable Setup After Use

After the first admin is created:

- Remove `ENABLE_ADMIN_SETUP=true` from local `.dev.vars`, or set it to false/blank.
- Remove or rotate `ADMIN_SETUP_SECRET`.
- In production, remove or disable the environment variable/secret through Cloudflare settings.
- Confirm that `POST /admin/setup/first-admin` no longer exposes setup behavior.

## Confirmations

- Frontend apps were not modified.
- No admin UI was created.
- No News, Events, Projects, Staff, or Partners CRUD was implemented.
- No R2 upload logic was implemented.
- No public content was migrated.
- No database migration was added or applied.
- No admin user was created by this phase.
- No real credentials or secrets were committed.

## Warnings

- The setup endpoint must only be enabled during a short, controlled setup window.
- Login will continue to fail until the first admin is inserted through this route or another approved secure setup process.
- The local example uses placeholder credentials only and must be replaced by the human during setup.
- Remote D1 setup must be handled separately and should not run without explicit approval.

## Recommended Phase 9

Proceed to a backend admin module foundation phase only after the first admin setup path is reviewed. Recommended next work: authenticated admin CRUD planning or implementation for one low-risk module, while keeping cookie auth enforced and frontend integration separate.
