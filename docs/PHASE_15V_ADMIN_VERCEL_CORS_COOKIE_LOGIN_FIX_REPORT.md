# Phase 15V Admin Vercel CORS Cookie Login Fix Report

## Scope

Worked in:

- `apps/api`
- `docs`

Inspected `apps/admin-site/lib/admin-api.ts`; no admin-site code change was needed.

No public-site design, admin UI design, database schema, auth security model, secrets, `.env.local`, or `.dev.vars` files were changed.

## Files Changed

- `apps/api/src/config/cors.ts`
- `apps/api/src/config/cookies.ts`
- `apps/api/src/utils/session.ts`
- `apps/api/wrangler.jsonc`
- `docs/PHASE_15V_ADMIN_VERCEL_CORS_COOKIE_LOGIN_FIX_REPORT.md`

## CORS Fix

Added the required default allowed origins in `apps/api/src/config/cors.ts`:

- `https://green-life-admin-site.vercel.app`
- `https://green-life-public-site.vercel.app`
- `http://localhost:3000`
- `http://localhost:3001`

The API still honors any additional origins supplied through `CORS_ALLOWED_ORIGINS`.

`wrangler.jsonc` now explicitly sets:

```text
CORS_ALLOWED_ORIGINS=https://green-life-admin-site.vercel.app,https://green-life-public-site.vercel.app,http://localhost:3000,http://localhost:3001
```

The existing CORS middleware already:

- Reflects the request origin only when it is allowed.
- Sets `Access-Control-Allow-Credentials: true`.
- Allows `GET,POST,PUT,PATCH,DELETE,OPTIONS`.
- Allows `Content-Type,Authorization`.
- Handles preflight `OPTIONS` with `204`.

## Cookie Fix

Updated live admin session cookie serialization in `apps/api/src/utils/session.ts`.

Production HTTPS cookies now use:

- `HttpOnly`
- `Secure`
- `SameSite=None`
- `Path=/`

Local HTTP behavior remains compatible by using:

- `HttpOnly`
- `SameSite=Lax`
- `Path=/`

The session token remains in an HTTP-only cookie and is not exposed to JavaScript.

## Admin Fetch Credentials Status

Checked `apps/admin-site/lib/admin-api.ts`.

The centralized `requestApi()` wrapper already uses:

```ts
credentials: "include"
```

This covers login, `session/me`, logout, change password, CRUD, and media upload requests because they all go through the same wrapper.

No admin-site code change was needed.

## Typecheck

`pnpm --recursive typecheck`: Passed after rerunning with approved network/workspace access.

## API Redeploy

Command attempted:

```bash
pnpm --filter api exec wrangler deploy
```

Result: Failed because Wrangler could not fetch an auth token in this non-interactive environment.

Wrangler error:

```text
In a non-interactive environment, it's necessary to set a CLOUDFLARE_API_TOKEN environment variable for wrangler to work.
```

The code fix is ready, but the remote Worker was not redeployed from this session because `CLOUDFLARE_API_TOKEN` is not available.

## Remote Preflight Check

Checked the currently deployed API before redeploy:

```bash
curl.exe -i -X OPTIONS https://green-life-rwanda-api.movie-night-api.workers.dev/admin/auth/login \
  -H "Origin: https://green-life-admin-site.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"
```

Current deployed result:

- `204 No Content`
- `Vary: Origin`
- Missing `Access-Control-Allow-Origin`
- Missing `Access-Control-Allow-Credentials`

This confirms the deployed Worker still has the CORS problem until the API is redeployed.

## Remote Admin Account Status

Attempted to check remote D1 active admin count with:

```bash
pnpm --filter api exec wrangler d1 execute green-life-rwanda --remote --command "SELECT COUNT(*) AS active_admins FROM admins WHERE deleted_at IS NULL AND status = 'active';"
```

Result: Blocked by the same missing `CLOUDFLARE_API_TOKEN` Wrangler auth issue.

Remote admin account existence could not be confirmed from this session.

If the remote admin account still needs setup, use the existing guarded setup flow:

1. Temporarily enable `ENABLE_ADMIN_SETUP=true` in the deployed API environment.
2. Set `ADMIN_SETUP_SECRET` securely in Cloudflare, not in git.
3. Call `POST /admin/setup/first-admin` with the `x-admin-setup-secret` header and the first admin name/email/password payload.
4. Disable `ENABLE_ADMIN_SETUP` immediately after the first admin is created.

Do not invent credentials and do not commit setup secrets.

## Remaining Required Manual Step

Set `CLOUDFLARE_API_TOKEN` in the terminal/session with permission to deploy the Worker and read remote D1, then rerun:

```bash
pnpm --filter api exec wrangler deploy
```

After deploy, retest:

- Login from `https://green-life-admin-site.vercel.app/login`
- Preflight includes `Access-Control-Allow-Origin: https://green-life-admin-site.vercel.app`
- Preflight includes `Access-Control-Allow-Credentials: true`
- Login response sets `glr_admin_session` with `HttpOnly; Secure; SameSite=None; Path=/`
- Session persists and dashboard opens

## Commit Status

No commit was made.
