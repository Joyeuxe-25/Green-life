# Phase 8B Admin Cookie Authentication Report

Date: 2026-06-06

Scope: backend-only admin authentication foundations using Hono, D1, Web Crypto, and secure HTTP-only cookies. No frontend login UI, admin forms, CRUD modules, R2 upload logic, public content migration, remote D1 migration, package installation, deletion, or commit was performed.

## Files Inspected

- `apps/api/src/index.ts`
- `apps/api/src/routes/admin-auth.ts`
- `apps/api/src/config/cookies.ts`
- `apps/api/src/types.ts`
- `apps/api/src/db/client.ts`
- `docs/PHASE_7_BACKEND_FOUNDATION_REPORT.md`
- `docs/PHASE_8A_LOCAL_D1_MIGRATION_VERIFICATION_REPORT.md`

## Files Changed

- `apps/api/src/types.ts`
- `apps/api/src/utils/http.ts`
- `apps/api/src/config/cookies.ts`
- `apps/api/src/config/cors.ts`
- `apps/api/src/middleware/cors.ts`
- `apps/api/src/routes/admin-auth.ts`

## Files Created

- `apps/api/src/utils/password.ts`
- `apps/api/src/utils/session.ts`
- `apps/api/src/db/admin.ts`
- `apps/api/src/middleware/require-admin.ts`
- `docs/PHASE_8B_ADMIN_COOKIE_AUTH_REPORT.md`

## Auth Routes Implemented

Mounted under existing API route group:

- `POST /admin/auth/login`
- `GET /admin/auth/me`
- `POST /admin/auth/logout`
- `POST /admin/auth/change-password`

Also retained:

- `GET /admin/auth/`

### Login Behavior

`POST /admin/auth/login`:

- Accepts email and password from JSON.
- Looks up an active admin by email in the D1 `admin` table.
- Verifies the provided password against `password_hash`.
- Sets the `glr_admin_session` HTTP-only cookie if valid.
- Updates `last_login_at`.
- Returns safe admin info only: `id`, `name`, `email`.

It does not return:

- `password_hash`
- session secret
- raw cookie value

### Me Behavior

`GET /admin/auth/me`:

- Reads the admin session cookie.
- Verifies the signed session.
- Confirms the admin still exists and is active.
- Returns safe admin info only.

### Logout Behavior

`POST /admin/auth/logout`:

- Clears the admin session cookie.
- Returns a success response.

### Change Password Behavior

`POST /admin/auth/change-password`:

- Requires a valid session cookie through `requireAdmin()`.
- Accepts current password, new password, and confirm password.
- Rejects missing, mismatched, or weak new passwords.
- Verifies current password.
- Hashes and stores the new password hash.
- Updates `password_updated_at`.
- Clears the session cookie and requires login again.

## Password Hashing Summary

Created:

- `apps/api/src/utils/password.ts`

Implemented:

- `hashPassword(password: string): Promise<string>`
- `verifyPassword(password: string, storedHash: string): Promise<boolean>`

Approach:

- Web Crypto PBKDF2.
- SHA-256.
- Random salt.
- 310,000 iterations.
- Stored format includes algorithm, iterations, salt, and hash.

Plain text passwords are never stored.

## Cookie And Session Summary

Created:

- `apps/api/src/utils/session.ts`

Implemented:

- `createAdminSessionCookiePayload(adminId, email, expiresAt)`
- `signSession(payload, secret)`
- `verifySession(cookieValue, secret)`
- `getSessionFromCookie(c)`
- `setAdminSessionCookie(c, sessionValue)`
- `clearAdminSessionCookie(c)`

Approach:

- HMAC SHA-256 signed session payload.
- Payload includes admin ID, email, and expiry timestamp.
- Cookie name defaults to `glr_admin_session`.
- Cookie is HTTP-only.
- Cookie uses `SameSite=Lax`.
- Cookie uses `Path=/`.
- Cookie uses `Secure` when the request URL is HTTPS.
- Optional `COOKIE_DOMAIN` is supported for later shared-subdomain deployment.

No localStorage token auth was added.

No session secret is exposed to frontend code.

## Middleware Summary

Created:

- `apps/api/src/middleware/require-admin.ts`

Behavior:

- Verifies the admin session cookie.
- Loads the active admin from D1.
- Attaches safe admin info to Hono context as `admin`.
- Rejects unauthorized requests with `401`.

This middleware is currently used by change-password only. It was not applied to placeholder CRUD route groups.

## Database Helper Summary

Created:

- `apps/api/src/db/admin.ts`

Helpers:

- `findActiveAdminByEmail`
- `findActiveAdminById`
- `updateAdminLastLogin`
- `updateAdminPasswordHash`
- `safeAdmin`

These helpers query only the existing `admin` table.

No new database tables were added.

No database migrations were added or applied.

## CORS And Cookie Notes

Updated backend CORS placeholder to:

- Read `CORS_ALLOWED_ORIGINS`.
- Echo `Access-Control-Allow-Origin` only for approved origins.
- Set `Access-Control-Allow-Credentials: true` only for approved origins.
- Handle `OPTIONS` preflight.

This prepares admin frontend requests to later use:

```ts
credentials: "include"
```

It does not make production CORS overly permissive.

## Environment Variables Needed

Required/planned:

- `ADMIN_SESSION_SECRET`
- `ADMIN_SESSION_COOKIE_NAME`
- `ADMIN_SESSION_EXPIRES_DAYS`
- `COOKIE_DOMAIN` optional
- `CORS_ALLOWED_ORIGINS`

No real secret values were committed.

## First Admin Setup Warning

No admin user was created in this phase.

There is no public registration endpoint.

There is no default password.

The first admin user should be inserted later through an explicitly approved secure setup phase, such as:

- a local-only setup script that hashes the password using the backend hashing utility, or
- a manual insert using a securely generated password hash.

Never insert or commit a plain text password.

## Security Notes

- Admin auth uses HTTP-only cookies, not localStorage.
- `ADMIN_SESSION_SECRET` must remain backend-only.
- Login returns only safe admin fields.
- Change password clears the current session and requires login again.
- Password hashing uses PBKDF2/SHA-256 with random salt and iteration metadata.
- Session cookies are signed with HMAC SHA-256.
- Admin existence and active status are checked on `/me` and protected middleware.

## Verification

Attempted:

```bash
pnpm --filter api typecheck
```

Result:

- First sandboxed run failed with a pnpm `fetch failed` environment issue.
- Rerun with approval completed TypeScript verification successfully.

No Wrangler D1 command was run.

## Local Testing Commands

Run later:

```bash
pnpm --filter api dev
curl.exe http://localhost:8787/health
curl.exe http://localhost:8787/admin/auth/
```

Because no admin exists yet, login will return invalid credentials until the first admin user is inserted in a later approved setup phase.

Example login command for later, after a secure admin is created:

```bash
curl.exe -i -X POST http://localhost:8787/admin/auth/login -H "Content-Type: application/json" --data "{\"email\":\"admin@example.com\",\"password\":\"REPLACE_WITH_REAL_PASSWORD\"}"
```

## Confirmations

- Frontend apps were not modified.
- No public-site files were modified.
- No admin-site files were modified.
- No database migration was added.
- No database migration was applied.
- No remote D1 migration was applied.
- No admin user was created.
- No CRUD endpoints were implemented.
- No R2 logic was implemented.
- No admin forms were built.
- No public content was migrated.
- The old static website was not deleted.
- `reports.html` was not deleted.
- `excluded legacy team meeting image` was not used.
- No packages were installed.
- No commit was made.

## Recommended Next Phase

Phase 8C should create an explicitly approved secure first-admin setup path, preferably local-only, so login can be tested without adding insecure defaults. After that, a later phase can integrate the admin frontend login UI with cookie-based API requests.

Do not proceed to CRUD, R2, public content migration, or frontend auth integration without explicit approval.
