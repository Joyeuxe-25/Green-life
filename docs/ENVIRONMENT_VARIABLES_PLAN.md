# Environment Variables Plan

This document lists planned environment variables and Cloudflare bindings for later phases. Do not place real secrets, passwords, tokens, or private values in this repository.

## API / Cloudflare Workers

### Bindings

- `DATABASE`: Cloudflare D1 binding for the Green Life Rwanda database.
- `MEDIA_BUCKET`: Cloudflare R2 bucket binding for uploaded images, videos, and partner logos.

### Secrets / Variables

- `ADMIN_SESSION_SECRET`: secret used by the API to sign or protect the admin session cookie.
- `ADMIN_SESSION_COOKIE_NAME`: admin session cookie name. Recommended value: `glr_admin_session`.
- `ADMIN_SESSION_EXPIRES_DAYS`: number of days before an admin session expires.
- `ENABLE_ADMIN_SETUP`: backend-only setup switch for creating the first admin. It must equal `true` before the first-admin setup route can run, and should normally be false or absent.
- `ADMIN_SETUP_SECRET`: backend-only private setup secret checked through the `x-admin-setup-secret` request header during controlled first-admin setup.
- `PUBLIC_SITE_URL`: deployed public website URL.
- `ADMIN_SITE_URL`: deployed admin website URL.
- `CORS_ALLOWED_ORIGINS`: comma-separated list of allowed browser origins for API requests.
- `COOKIE_DOMAIN`: optional cookie domain. Only needed if using shared subdomains.

## Admin Authentication Cookie Plan

Admin authentication will use secure HTTP-only cookies, not localStorage token storage.

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

## First Admin Setup Plan

The first admin account will be created through a guarded backend-only setup route, not through public registration.

Planned behavior:

- `ENABLE_ADMIN_SETUP` must explicitly equal `true`.
- `ADMIN_SETUP_SECRET` must be configured and provided in the `x-admin-setup-secret` request header.
- The route must refuse setup when an active admin already exists.
- The setup route must hash the password before storage and return only safe admin fields.
- The setup route must not automatically create a session cookie.
- After first admin creation, disable `ENABLE_ADMIN_SETUP` again.

Security notes:

- Do not commit real setup secrets.
- For production, configure `ADMIN_SETUP_SECRET` with Wrangler secrets or Cloudflare dashboard secrets.
- Do not expose `ADMIN_SETUP_SECRET` or `ADMIN_SESSION_SECRET` to the frontend.
- This setup path is not a registration system and must remain unavailable during normal operation.

## Public Site

- `NEXT_PUBLIC_API_URL`: base URL for the public site to read public API content.

## Admin Site

- `NEXT_PUBLIC_API_URL`: base URL for the admin site to access API routes.

## Notes

- Values must be configured through deployment environment settings or local untracked `.env` / `.dev.vars` files.
- Do not commit real production secrets.
- D1 and R2 binding details should be finalized when the backend and deployment phases begin.
