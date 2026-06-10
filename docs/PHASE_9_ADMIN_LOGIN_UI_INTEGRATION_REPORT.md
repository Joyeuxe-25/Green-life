# Phase 9 Admin Login UI Integration Report

## Scope

Phase 9 connected the admin Next.js frontend to the existing backend cookie-auth routes. No backend CRUD, D1 schema, migrations, R2/media upload, public-site content migration, package installation, or real credential hardcoding was done.

## Files Changed

- `apps/admin-site/.env.local.example`
- `apps/admin-site/lib/admin-api.ts`
- `apps/admin-site/app/login/page.tsx`
- `apps/admin-site/app/change-password/page.tsx`
- `apps/admin-site/components/admin-shell.tsx`
- `apps/admin-site/components/admin-navbar.tsx`
- `apps/admin-site/components/admin-sidebar.tsx`
- `apps/api/.dev.vars.example`
- `docs/PHASE_9_ADMIN_LOGIN_UI_INTEGRATION_REPORT.md`

## Routes Connected

Backend auth routes used by the admin frontend:

- `POST /admin/auth/login`
- `GET /admin/auth/me`
- `POST /admin/auth/logout`
- `POST /admin/auth/change-password`

All frontend requests use `fetch` with:

```ts
credentials: "include"
```

## Auth Storage Confirmation

Admin authentication remains HTTP-only cookie based.

- No `localStorage` usage was added.
- No `sessionStorage` usage was added.
- No admin token is stored in frontend JavaScript.
- No session secret is exposed to the frontend.

## Admin API Configuration

Admin site environment example:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8787
```

File:

```text
apps/admin-site/.env.local.example
```

Backend local CORS example was updated to include common local frontend ports:

```text
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

Only `apps/api/.dev.vars.example` was updated. No real `.dev.vars` file was created or modified.

## Login Page

`/login` now includes:

- Email input
- Password input
- Submit button
- Loading state
- Error message display

Successful login redirects to:

```text
/dashboard
```

Failed login displays the backend error message when available.

## Protected Pages

Protection is implemented through `AdminShell`, which calls:

```text
GET /admin/auth/me
```

If the session check succeeds, the page renders. If it fails, the user is redirected to:

```text
/login
```

Protected routes:

- `/`
- `/dashboard`
- `/news`
- `/news/add`
- `/news/update`
- `/events`
- `/events/add`
- `/events/update`
- `/projects`
- `/projects/add`
- `/projects/update`
- `/staff`
- `/staff/add`
- `/staff/update`
- `/partners`
- `/partners/add`
- `/partners/update`
- `/contact-messages`
- `/donation-messages`
- `/change-password`

Public route:

- `/login`

## Logout

The navbar and sidebar logout controls call:

```text
POST /admin/auth/logout
```

After logout, the user is redirected to:

```text
/login
```

## Change Password

`/change-password` now includes:

- Current password field
- New password field
- Confirm new password field
- Client-side required/match/minimum-length checks
- Loading state
- Error message display

The form calls:

```text
POST /admin/auth/change-password
```

After success, the user is redirected to `/login` because the backend clears the current session cookie.

## Session Display

After the session check succeeds, the admin navbar/sidebar show the current admin name and email returned by the backend.

## Local Testing Steps

Start the API:

```powershell
pnpm --filter api dev
```

Start the admin site:

```powershell
pnpm --filter admin-site dev
```

Typecheck:

```powershell
pnpm --recursive typecheck
```

Manual browser test:

1. Open the admin login page.
2. Log in with the local admin account.
3. Confirm `/dashboard` opens.
4. Refresh `/dashboard` and confirm the session remains active.
5. Click logout and confirm protected pages redirect to `/login`.
6. Test `/change-password` if needed; confirm success redirects to `/login`.

## Warnings and Known Limitations

- This is a client-side guard for Phase 9. Server-side admin route protection can be added later if needed.
- Login requires a previously created local admin account.
- Cross-origin cookie auth requires the backend CORS allowed origins to include the admin site origin.
- Do not use `localStorage` or `sessionStorage` for admin auth in later phases.
- Do not expose `ADMIN_SESSION_SECRET` or setup secrets to frontend code.

## Recommended Next Phase

Proceed to authenticated admin CRUD integration for one low-risk module, such as News or Partners, while continuing to keep backend implementation, frontend UI, D1, and R2 responsibilities separated.
