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
