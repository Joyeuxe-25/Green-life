# Phase 14: Remove Old Static Site Report

## Summary

Phase 14 removed the old root-level static HTML/CSS/JS website after verifying that the new workspace structure is present:

- `apps/public-site`
- `apps/admin-site`
- `apps/api`
- `packages/shared`

No Next.js public-site files were redesigned or changed. No admin, API, database, R2, or authentication logic was changed.

## Files And Folders Removed

Removed old root static HTML pages:

- `index.html`
- `about.html`
- `programs.html`
- `projects.html`
- `impact.html`
- `news.html`
- `staff.html`
- `contact.html`
- `donate.html`
- `get-involved.html`
- `reports.html`

The requested `events.html` and `partners.html` files were checked but were not present at the repository root.

Removed old root static folders:

- `css/`
- `js/`
- `assets/`

The removed `assets/` folder contained only old static-site images and logos. Active workspace app searches did not show references to the root `assets/` folder from `apps/public-site`, `apps/admin-site`, or `apps/api`.

## Files And Folders Kept

Kept core workspace folders:

- `apps/`: contains the active API, admin site, and public Next.js site.
- `packages/`: contains shared workspace code.
- `docs/`: contains project history and phase reports.
- `00_INPUTS/`: kept untouched and ignored; it is input-only project material.
- `node_modules/` and `.pnpm-store/`: dependency folders.

Kept root project files:

- `.gitignore`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `tsconfig.base.json`
- `README.md`
- `cookies.txt`

## Search Results

Reports search:

- Runtime app search found no Reports navigation in `apps/public-site`.
- `reports.html` and Reports references still appear in historical documentation and API migration notes, where they document earlier phases and explicitly note that Reports should not be part of the new site.

Banned image reference search:

- No runtime app references were found for `about-team-meeting` or `8Z6A5893`.
- The terms remain only in the Phase 11B report as documented search/exclusion results.

Old static CSS/JS reference search:

- No active app references to the removed root `css/` or `js/` folders were found.
- Normal Next/Tailwind references remain, such as `app/globals.css`, `postcss.config.mjs`, and package metadata.
- Historical docs still mention old `css/` and `js/` files as part of earlier static-site audits.

Staff hardcoding check:

- `apps/public-site` uses dynamic staff data from the public API helper and renders staff via components.
- No hardcoded staff member names were found in the new public site.

## Confirmations

- The Next.js public site remains in `apps/public-site`.
- The admin site remains in `apps/admin-site`.
- The API remains in `apps/api`.
- Shared packages remain in `packages/shared`.
- `00_INPUTS/` was not touched.
- No public Next.js design changes were made.
- No admin-site changes were made.
- No API logic changes were made.
- No database, R2, or authentication work was done.
- The old root static site files and folders were removed.

## Testing

Typecheck command:

```powershell
pnpm --recursive typecheck
```

Result: passed after rerunning with approval because the first sandboxed attempt failed with `fetch failed`.

## Recommended Next Phase

Proceed with a focused verification phase:

- Start the API and public Next.js site locally.
- Confirm the public site renders from dynamic API data.
- Confirm no links point to removed root `.html` pages.
- Confirm production/deployment routing points to `apps/public-site` rather than the removed root static files.
