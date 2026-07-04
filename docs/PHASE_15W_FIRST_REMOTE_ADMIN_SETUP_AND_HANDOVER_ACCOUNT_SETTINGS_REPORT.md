# Phase 15W First Remote Admin Setup and Handover Account Settings Report

## Scope

Worked in:

- `apps/api`
- `apps/admin-site`
- `docs`

No public-site design, public-site code, database schema, media import, content, `.env.local`, `.dev.vars`, secrets, setup keys, or plain passwords were committed.

## Files Changed

- `apps/api/src/types.ts`
- `apps/api/src/db/admin.ts`
- `apps/api/src/routes/admin-setup.ts`
- `apps/api/src/routes/admin-auth.ts`
- `apps/admin-site/lib/admin-api.ts`
- `apps/admin-site/app/setup/page.tsx`
- `apps/admin-site/app/account/page.tsx`
- `apps/admin-site/components/admin-profile-menu.tsx`
- `docs/PHASE_15W_FIRST_REMOTE_ADMIN_SETUP_AND_HANDOVER_ACCOUNT_SETTINGS_REPORT.md`

## Existing Auth and Hashing Inspection

Confirmed the existing password hashing helper is:

- `apps/api/src/utils/password.ts`
- PBKDF2-SHA256
- 310,000 iterations
- per-password random salt

The new setup and account update flows reuse the existing `hashPassword()` and `verifyPassword()` helpers. No new hashing system was added.

## API First Admin Setup

Added/confirmed secure first-admin setup at:

```text
POST /admin/setup
```

Request body:

```json
{
  "setupKey": "...",
  "name": "...",
  "email": "...",
  "password": "..."
}
```

Security behavior:

- Only works when `ENABLE_ADMIN_SETUP` is exactly `"true"`.
- `setupKey` must match `ADMIN_SETUP_KEY`.
- `ADMIN_SETUP_SECRET` is still supported as a compatibility fallback for the older `/admin/setup/first-admin` flow.
- Setup is blocked unless the `admin` table has `0` total rows.
- Password is hashed with the existing PBKDF2 helper before insert.
- Email is normalized to lowercase.
- Weak passwords are blocked.
- Password hash is never returned.
- Response returns a success message only.

The older guarded endpoint remains available:

```text
POST /admin/setup/first-admin
```

It now shares the same underlying setup logic.

## Admin `/setup` Page

Added:

```text
/setup
```

Fields:

- Setup key
- Name
- Email
- Password
- Confirm password

Behavior:

- Submits to `POST /admin/setup`.
- Uses the shared admin API helper, which sends `credentials: "include"`.
- Shows clear API errors for disabled setup, invalid setup key, existing admin, weak password, and network/CORS failures.
- Redirects to `/login` after successful setup.

## Account Settings

Added protected page:

```text
/account
```

The profile menu now links to Account Settings.

The logged-in admin can update:

- Name
- Email
- Password

Rules enforced by the API:

- Current password is required for every account update.
- Name changes require current password.
- Email changes require current password.
- Password changes require current password.
- New password must be strong.
- Duplicate email is blocked if another active admin already uses it.
- `password_hash` is never returned.

## Session and Logout Behavior

For `/admin/auth/me` PATCH:

- Name-only update returns the updated safe admin object and keeps the session.
- Email change clears the session cookie and returns `requiresLogin: true`.
- Password change clears the session cookie and returns `requiresLogin: true`.
- Email plus password change also clears the session cookie.

The frontend redirects to `/login` when `requiresLogin` is true.

## Admin API Request Rules

Confirmed `apps/admin-site/lib/admin-api.ts` centralizes admin requests through `requestApi()`, which uses:

```ts
credentials: "include"
```

This covers:

- Login
- Session/me
- Logout
- Setup
- Account update
- Change password
- CRUD
- Uploads

## Verification

Typecheck:

```bash
pnpm --recursive typecheck
```

Result: Passed after rerunning with approved workspace access.

Admin build:

```bash
pnpm --filter admin-site build
```

Result: Passed after rerunning with approved workspace access.

Build output includes:

- `/setup`
- `/account`

## API Deploy

Command attempted:

```bash
pnpm --filter api exec wrangler deploy
```

Result: Failed because Wrangler cannot authenticate in this non-interactive session without `CLOUDFLARE_API_TOKEN`.

Wrangler error:

```text
In a non-interactive environment, it's necessary to set a CLOUDFLARE_API_TOKEN environment variable for wrangler to work.
```

The API changes are not deployed from this session.

## Remote First Admin Setup Notes

After the API is deployed and the admin-site Vercel deployment includes `/setup`:

1. Set `ENABLE_ADMIN_SETUP=true` in Cloudflare for the API.
2. Set `ADMIN_SETUP_KEY` as a Cloudflare secret.
3. Open `https://green-life-admin-site.vercel.app/setup`.
4. Create the first admin.
5. Confirm the admin row exists:

```bash
pnpm exec wrangler d1 execute green-life-rwanda --remote --command "SELECT id, name, email, is_active FROM admin;"
```

6. Disable setup immediately after first admin creation.

Requested command:

```bash
pnpm exec wrangler secret put ENABLE_ADMIN_SETUP
```

Set value:

```text
false
```

Then redeploy:

```bash
pnpm exec wrangler deploy
```

Note: `ENABLE_ADMIN_SETUP` is treated by the Worker as an environment binding. Whether it is set as a secret or plain variable, it must be unavailable or set to `false` after setup.

## Remaining Required Deployed QA

Could not test the deployed flow from this session because the API deploy was blocked.

After deploy and Vercel update, test:

- `https://green-life-admin-site.vercel.app/setup`
- First admin creation
- Login at `/login`
- Account Settings name change
- Account Settings email change
- Account Settings password change
- Current password is required
- Duplicate email is blocked
- Re-login works after email/password change
- `password_hash` is never exposed

## Commit Status

No commit was made.

## Hotfix: Explicit `/admin/setup` Mount

After `/setup` was added to the admin frontend, the deployed API still returned:

```text
POST /admin/setup -> 404 Not Found
```

CORS headers were present, so this was not a CORS issue.

Local inspection found:

- `apps/api/src/index.ts` already imported `adminSetupRoutes`.
- `apps/api/src/index.ts` already mounted `app.route("/admin/setup", adminSetupRoutes)`.
- `apps/api/src/routes/admin-setup.ts` already defined `adminSetupRoutes.post("/", ...)`.
- `apps/admin-site/app/setup/page.tsx` calls `setupFirstAdmin()`.
- `apps/admin-site/lib/admin-api.ts` calls `NEXT_PUBLIC_API_BASE_URL + "/admin/setup"`.

To remove any Hono trailing-slash or grouped-route ambiguity, the setup handler is now exported and mounted directly:

```ts
app.post("/admin/setup", handleFirstAdminSetup);
app.route("/admin/setup", adminSetupRoutes);
```

Final intended endpoint after deploy:

```text
POST https://green-life-rwanda-api.movie-night-api.workers.dev/admin/setup
```

The route was not missing as a grouped route in `src/index.ts`, but the explicit direct `POST /admin/setup` mount was missing. This hotfix adds that direct mount.

Hotfix verification:

```bash
pnpm --recursive typecheck
```

Result: Passed after rerunning with approved workspace access.

Hotfix deploy attempt:

```bash
pnpm --filter api exec wrangler deploy
```

Result: Failed because this environment still has no `CLOUDFLARE_API_TOKEN`.

Requested curl test after failed deploy:

```bash
curl.exe -i -X POST "https://green-life-rwanda-api.movie-night-api.workers.dev/admin/setup" -H "Content-Type: application/json" -H "Origin: https://green-life-admin-site.vercel.app" --data "{\"setupKey\":\"wrong-test-key\",\"name\":\"Test Admin\",\"email\":\"test@example.com\",\"password\":\"StrongPass123!\"}"
```

Observed remote result:

```text
HTTP/1.1 404 Not Found
{"ok":false,"error":{"message":"Not found"}}
```

This confirms the deployed Worker has not received the hotfix yet. A token-backed `wrangler deploy` is still required before the remote curl can return the expected non-404 response such as invalid setup key, setup disabled, admin already exists, or validation error.

## Hotfix 4: Cloudflare PBKDF2 Iteration Limit

First-admin setup reached password hashing but failed in the deployed Worker with:

```text
NotSupportedError: Pbkdf2 failed: iteration counts above 100000 are not supported (requested 310000).
```

Root cause:

- `apps/api/src/utils/password.ts` used PBKDF2 with `310000` iterations.
- Cloudflare Workers supports PBKDF2 iteration counts up to `100000`.

Fix:

- Changed new password hashes from `310000` iterations to `100000`.
- Added a named `PBKDF2_ITERATIONS = 100000` constant.
- Added `MAX_WORKER_PBKDF2_ITERATIONS = 100000`.
- Kept PBKDF2-SHA256.
- Kept random per-password salt.
- Kept constant-time hash comparison.
- Kept stored hash format with the iteration count included.
- Updated verification to reject stored hashes above the Worker-supported limit instead of trying unsupported PBKDF2 work.

Remote D1 currently has no admin rows, so no migration was needed for existing remote admin hashes.

Setup error handling was improved:

- If hashing or insert fails, the Worker logs the real error for `wrangler tail`.
- The browser receives controlled JSON:

```json
{
  "ok": false,
  "error": {
    "message": "Failed to create first admin"
  }
}
```

No password, setup key, salt, or hash is exposed.

Verification:

```bash
pnpm --recursive typecheck
```

Result: Passed after rerunning with approved workspace access.

Deploy:

```bash
pnpm --filter api exec wrangler deploy
```

Result: Passed.

Deployed Worker:

```text
https://green-life-rwanda-api.movie-night-api.workers.dev
```

Version ID:

```text
502c33fa-24c6-4f22-a878-223e099d8157
```

Safe setup endpoint probe with a deliberately wrong setup key:

```bash
curl.exe -i -X POST "https://green-life-rwanda-api.movie-night-api.workers.dev/admin/setup" -H "Content-Type: application/json" -H "Origin: https://green-life-admin-site.vercel.app" --data-raw "{\"setupKey\":\"wrong-test-key\",\"name\":\"Test Admin\",\"email\":\"test@example.com\",\"password\":\"StrongPass123!\"}"
```

Result:

```text
HTTP/1.1 401 Unauthorized
{"ok":false,"error":{"message":"Invalid setup key"}}
```

This confirms:

- The deployed endpoint no longer returns 404.
- CORS credentials headers are present.
- The Worker reaches setup-key validation before password hashing.

Real first-admin creation was not performed from this session because the real `ADMIN_SETUP_KEY` was not provided and must not be guessed, exposed, or committed.

Remote admin table verification:

```bash
pnpm --filter api exec wrangler d1 execute green-life-rwanda --remote --command "SELECT id, name, email, is_active FROM admin;"
```

Result:

```json
[]
```

The remote `admin` table is still empty until the real setup key is used to create the first admin.
