# Phase 15B: Initial Content And Media Population Report

## Summary

Phase 15B populated the local D1 preview database with approved initial Green Life Rwanda public content so the dynamic Next.js public site is not empty.

Content was added through a D1 seed file and applied to the local D1 database. No content was hardcoded into `apps/public-site` React pages. No public-site design work, admin CRUD logic, API auth logic, database schema change, or R2 feature work was performed.

## Files Changed

- `apps/api/seeds/0001_initial_public_content.sql`
  - Added an idempotent local-preview seed for public content.
- `docs/PHASE_15B_INITIAL_CONTENT_MEDIA_POPULATION_REPORT.md`
  - Added this report.

## Local D1 Migration Status

Command run:

```powershell
pnpm --filter api exec wrangler d1 migrations list green-life-rwanda --local
```

Result:

- Local D1 reported: `No migrations to apply!`

## Content Seed Created

Seed file:

```powershell
apps/api/seeds/0001_initial_public_content.sql
```

The seed is safe to rerun. It uses stable IDs/keys with `ON CONFLICT` updates.

Tables populated:

- `content_blocks`
- `programs`
- `impact_stats`
- `projects`
- `partners`
- `site_settings`

The seed intentionally does not insert admin users, sessions, passwords, contact messages, donation messages, or media file rows.

## Content Added To Local D1

Applied command:

```powershell
cd apps/api
pnpm exec wrangler d1 execute green-life-rwanda --local --file seeds/0001_initial_public_content.sql
```

Result:

- Seed applied successfully to the local D1 database.

Verification query result:

- Published content blocks: `12`
- Published programs: `4`
- Published impact stats: `4`
- Active/completed projects: `3`
- Active partners: `7`
- Site settings: `7`

## Public Content Included

Homepage content blocks:

- Hero
- Mission preview
- Support CTA

About content blocks:

- Who we are
- Mission
- Vision
- History

Programs content:

- Intro content block
- Agroforestry Promotion
- Climate Action
- Youth Environmental Education
- Community Livelihoods

Impact stats:

- `350` smallholder farmers trained
- `329,425` trees planted
- `365` hectares restored
- Permanent tree nurseries established

Donate/contact/get-involved content:

- General approved support, contact, and participation text.
- No fake phone, email, bank, or payment details were inserted.
- Site settings note that official contact and donation details must be confirmed before production launch.

Initial projects:

- Agroforestry Project for Mushonyi Community-Led Restoration
- Enabling Environmental Clubs in Sustainable Agroforestry
- School Greening and Environmental Education Project

Initial partners:

- World Connect
- Biocoor
- Segal Family Foundation
- RGB
- Bridge of Hope
- FMI Ubumuntu
- Restore Local

Restore Local was inserted as text-only until a logo is provided.

## Enhanced Media Status

Expected zip path:

```powershell
00_INPUTS/05_enhanced_avif_media/Green_Life_Rwanda_Enhanced_AVIF_Media.zip
```

Status:

- The zip exists at the expected path.
- `30` enhanced AVIF images were found in the extracted image folder.
- `00_INPUTS/` remains ignored by Git.
- Images were not copied into `apps/public-site`.
- Images were not hardcoded into React pages.
- Images were not uploaded automatically in this phase.

Banned-image search:

- `about-team-meeting` and `8Z6A5893` appear only in `00_INPUTS/05_enhanced_avif_media/extracted/enhanced-media-guide.md` as excluded-image documentation.
- No banned image file was found in the extracted AVIF image set.

## Media Upload Preparation

An optional import script already exists:

```powershell
apps/api/scripts/import-enhanced-media.mjs
```

It reads:

- `00_INPUTS/05_enhanced_avif_media/enhanced-media-import-manifest.json`
- `00_INPUTS/05_enhanced_avif_media/extracted/assets/images`

Expected environment variables:

```powershell
$env:API_BASE_URL="http://localhost:8787"
$env:ADMIN_EMAIL="admin@example.com"
$env:ADMIN_PASSWORD="replace-with-local-password"
$env:ENHANCED_MEDIA_DIR="../../00_INPUTS/05_enhanced_avif_media/extracted/assets/images"
```

Manual import command from `apps/api`:

```powershell
pnpm exec node scripts/import-enhanced-media.mjs
```

Manual upload alternative:

1. Start the API.
2. Start the admin site.
3. Log in to admin.
4. Open `/media`.
5. Select enhanced AVIF images from `00_INPUTS/05_enhanced_avif_media/extracted/assets/images`.
6. Upload them through the Media Library.
7. Fill or verify alt text and captions from `enhanced-media-import-manifest.json`.
8. Confirm uploaded media appears in the Media Library.

## Commands Run

```powershell
pnpm --filter api exec wrangler d1 migrations list green-life-rwanda --local
```

```powershell
cd apps/api
pnpm exec wrangler d1 execute green-life-rwanda --local --file seeds/0001_initial_public_content.sql
```

```powershell
cd apps/api
pnpm exec wrangler d1 execute green-life-rwanda --local --command "SELECT (SELECT COUNT(*) FROM content_blocks WHERE status='published') AS content_blocks, (SELECT COUNT(*) FROM programs WHERE status='published') AS programs, (SELECT COUNT(*) FROM impact_stats WHERE status='published') AS impact_stats, (SELECT COUNT(*) FROM projects WHERE status IN ('active','completed') AND deleted_at IS NULL) AS projects, (SELECT COUNT(*) FROM partners WHERE status='active' AND deleted_at IS NULL) AS partners, (SELECT COUNT(*) FROM site_settings) AS site_settings;"
```

```powershell
pnpm --recursive typecheck
```

## Typecheck Result

Passed after rerunning with approval because the first sandboxed attempt failed with `fetch failed`.

## Confirmations

- No `apps/public-site` files were changed.
- No public-site React content hardcoding was added.
- No images were copied into `apps/public-site`.
- No admin CRUD logic was changed.
- No auth logic was changed.
- No database schema changes were made.
- No R2/media feature changes were made.
- `00_INPUTS/` was not committed and remains ignored.
- No real secrets were added.

## Known Limitations

- Enhanced images were prepared but not uploaded automatically.
- Contact phone, email, address, donation account, and payment details remain unconfirmed and were not invented.
- Seeded content is intended for local preview and should be reviewed before production import.
- Project media associations will happen after media files are uploaded through the Media Library.

## Recommended Next Phase

Run local browser QA with the populated D1 database:

- Start API and public site.
- Visit public pages and confirm content renders from the public API.
- Start admin site and confirm seeded content is editable through admin modules.
- Upload a small subset of enhanced AVIF images through `/media`.
- Attach/select uploaded media in future content/media association work as needed.
