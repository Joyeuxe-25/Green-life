# PHASE 15Y.2 Public Branding Fix Report

## Summary

Phase 15Y.2 investigated why the public site still rendered the old organization name while the admin site already showed `Green for Life Rwanda`.

The issue was not hardcoded public-site React text. The public site reads branding and page copy from the public API, and `apps/public-site/.env.local` points to the remote Worker API:

```env
NEXT_PUBLIC_API_BASE_URL=https://green-life-rwanda-api.movie-night-api.workers.dev
```

That remote API was still backed by remote D1 CMS/default content containing the old user-facing brand string.

## Root Cause

- Public header logo text comes from `/public/site-settings` -> `site_settings.site.name`.
- Public footer logo text and copyright come from `/public/site-settings` -> `site_settings.site.name` and `site_settings.footer.copyright`.
- Public hero/page content comes from `/public/*` endpoints -> `content_blocks` rows.
- Public program, partner, and media captions come from D1 content tables.
- Local seed/default source had already been updated, and the configured local D1 values were correct.
- The public site still displayed old branding because it was using the remote Worker API/D1, not the corrected local D1 data.

## Branding Source

Branding came from CMS/D1 data served through the API, plus already-correct React fallback text.

Checked sources:

- Hardcoded React/Next.js components: fallbacks already use `Green for Life Rwanda`.
- Shared public API helpers: no hardcoded old brand text.
- Metadata: `apps/public-site/app/layout.tsx` already uses `Green for Life Rwanda`.
- Seeded/default content: `apps/api/seeds/0001_initial_public_content.sql` already uses `Green for Life Rwanda`.
- CMS/site settings: remote D1 had stale old values and was updated.
- Public page content: remote D1 had stale old content blocks and was updated.

## Remote D1 Updates

A targeted remote D1 update was applied only to user-facing display columns. No infrastructure identifiers, routes, slugs, storage keys, bucket names, Worker names, database names, package names, or environment variable names were changed.

Updated remote D1 tables:

- `content_blocks`: `eyebrow`, `title`, `subtitle`, `summary`, `body`, `cta_label`, `secondary_cta_label`
- `programs`: `title`, `summary`, `body`
- `partners`: `name`, `description`
- `site_settings`: `label`, `value`
- `media_files`: `alt_text`, `caption`

Rows updated:

- `content_blocks`: 14 total rows, including the final `eyebrow` fix
- `programs`: 3 rows
- `partners`: 7 rows
- `site_settings`: 2 rows
- `media_files`: 9 rows

## Files Modified

- `docs/PHASE_15Y2_PUBLIC_BRANDING_FIX_REPORT.md`

No public-site source files required code changes in this phase because their fallback text and metadata were already correct. The fix was in the remote CMS/D1 content used by the public site.

## Public Site Verification

Verified remote API values after the fix:

- `site.name`: `Green for Life Rwanda`
- `footer.copyright`: `© 2026 Green for Life Rwanda. All rights reserved.`
- About mission summary: `Green for Life Rwanda promotes sustainable agroforestry practices in communities across Rwanda.`

A retrying HTTP check across 13 public API endpoints found no remaining exact old-brand payloads:

- `/public/site-settings`
- `/public/home`
- `/public/about`
- `/public/programs`
- `/public/projects`
- `/public/impact`
- `/public/contact`
- `/public/donate`
- `/public/get-involved`
- `/public/partners`
- `/public/news`
- `/public/events`
- `/public/staff`

Remote D1 verification returned zero remaining rows containing the old brand string in the checked display tables.

Public-site source search:

```powershell
rg -n "<old brand string>" apps/public-site
```

Result: no matches.

## Build Verification

Command run:

```powershell
pnpm --filter public-site build
```

Result: build passed. Next.js compiled successfully and generated all public routes.

## Confirmation

All current public-facing branding now displays:

`Green for Life Rwanda`

## Commit Status

No commit was created.
