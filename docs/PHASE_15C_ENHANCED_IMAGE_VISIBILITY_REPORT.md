# Phase 15C: Enhanced Image Visibility Report

## Summary

Phase 15C made the enhanced Green Life Rwanda AVIF images visible to the dynamic public website without hardcoding image paths into React pages and without copying images into `apps/public-site`.

Images were imported into local R2, registered in D1 `media_files`, exposed through a public API media file route, attached to public content blocks through `content_blocks.image_url`, and attached to projects through `media_files.entity_type` / `media_files.entity_id`.

No admin authentication logic was changed. No public-site redesign was performed.

## Enhanced Image Pack Check

Expected zip path:

```powershell
00_INPUTS/05_enhanced_avif_media/Green_Life_Rwanda_Enhanced_AVIF_Media.zip
```

Result:

- Zip exists at the expected path.
- `30` AVIF images were found in `00_INPUTS/05_enhanced_avif_media/extracted/assets/images`.
- `00_INPUTS/` remains ignored by Git.
- No images were copied into `apps/public-site`.

Banned image search:

- No banned AVIF image file was found.
- `about-team-meeting` and `8Z6A5893` appear only in the enhanced media guide as intentionally excluded images.

## Files Changed

API:

- `apps/api/src/db/public.ts`
  - Added first active attached media fields for public project/news/event responses.
  - Added an internal public media file lookup that includes `storage_key`.
- `apps/api/src/routes/public.ts`
  - Added `GET /public/media/file/:id` to stream active R2 media files by ID.
- `apps/api/scripts/import-enhanced-media-local.mjs`
  - Added local preview import helper for enhanced AVIF files.

Public site:

- `apps/public-site/lib/public-api.ts`
  - Added `image_url`, `image_alt_text`, and `image_caption` to project/news/event types.
- `apps/public-site/components/public-components.tsx`
  - Updated existing project/news/event cards to render API-provided image URLs.
- `apps/public-site/app/projects/[slug]/page.tsx`
  - Uses API-provided project image URL for the detail hero when available.
- `apps/public-site/app/news/[slug]/page.tsx`
  - Uses API-provided news image URL for the detail hero when available.
- `apps/public-site/app/events/[slug]/page.tsx`
  - Uses API-provided event image URL for the detail hero when available.
- `apps/public-site/app/globals.css`
  - Added a small existing-card image sizing rule.

Docs:

- `docs/PHASE_15C_ENHANCED_IMAGE_VISIBILITY_REPORT.md`

## Public Media Route

Added:

```text
GET /public/media/file/:id
```

Behavior:

- Looks up only active media.
- Reads the object from R2 using `storage_key`.
- Returns the R2 object body.
- Sets `Content-Type` from R2 metadata or the D1 media MIME type.
- Does not require admin auth.
- Does not expose private admin/session/password data.

Local smoke check:

```powershell
HEAD http://localhost:8787/public/media/file/enhanced-tree-nursery-landscape
```

Result:

- Status: `200`
- Content-Type: `image/avif`

## Media Import

Local import script:

```powershell
apps/api/scripts/import-enhanced-media-local.mjs
```

Command run from `apps/api`:

```powershell
pnpm exec node scripts/import-enhanced-media-local.mjs
```

Result:

- `30` enhanced AVIF files uploaded to local R2 bucket `green-life-rwanda-media`.
- `30` active `media_files` records registered in local D1.
- `30` records have populated `public_url` values.
- Public URLs use the local API route:

```text
http://localhost:8787/public/media/file/:id
```

## Content Block Image Mapping

The following `content_blocks.image_url` values were populated:

- `home/hero` -> `tree-nursery-landscape`
- `home/mission-preview` -> `community-seedling-training`
- `home/support-cta` -> `fruit-tree-plantation`
- `programs/intro` -> `tree-planting-demonstration`
- `impact/intro` -> `farmers-with-grevillea-seedlings`
- `contact/intro` -> `community-listening-session`
- `donate/intro` -> `fruit-tree-plantation`
- `get-involved/intro` -> `youth-community-seedling-training`
- `about/mission` -> `tree-nursery-landscape`
- `about/history` -> `community-field-activity`

## Project, News, And Event Attachments

Projects use `media_files.entity_type = 'project'` and `media_files.entity_id = projects.id`.

Attached project images:

- `project-mushonyi-restoration` -> `grevillea-seedlings-for-planting.avif`
- `project-nyanza-environmental-clubs` -> `tree-nursery-group.avif`
- `project-school-greening` -> `youth-community-seedling-training.avif`

News/events:

- The import script supports optional first-row attachments for `news` and `event`.
- Local D1 currently has `0` published news records and `0` public event records, so no news/event media rows were attached.
- No fake news/events were inserted.

Public API behavior:

- Project, news, and event list/detail responses now include:
  - `image_url`
  - `image_alt_text`
  - `image_caption`
- These values come from the first active attached `media_files` record ordered by `display_order`, then `created_at`.

## About Page Change

The `about/who-we-are` content block was set to `draft`.

Result:

- The public About page no longer receives the Who We Are block from the public API.

## Verification

Local D1 media verification:

- Active media records: `30`
- Active media records with `public_url`: `30`
- Project media attachments: `3`
- News media attachments: `0`
- Event media attachments: `0`

Typecheck:

```powershell
pnpm --recursive typecheck
```

Result:

- Passed after rerunning with approval because the first sandboxed attempt failed with `fetch failed`.

Source reference check:

- No `00_INPUTS` references in public-site/API source.
- No enhanced zip filename references in public-site/API source.
- No banned image references in public-site/API source.
- No selected image filenames hardcoded into public-site React components.

## Confirmations

- No images were hardcoded into React pages.
- No images were copied into `apps/public-site`.
- `00_INPUTS/` remains ignored and was not committed.
- No admin auth changes were made.
- No public-site redesign was performed.
- No project/news/event `cover_image_url` columns were added.
- Images are surfaced through D1/R2/API data.

## Commands To Reproduce

From the repository root:

```powershell
pnpm --filter api exec wrangler d1 migrations list green-life-rwanda --local
```

From `apps/api`:

```powershell
pnpm exec node scripts/import-enhanced-media-local.mjs
```

Run the local API and public site:

```powershell
pnpm --filter api dev
pnpm --filter public-site dev
```

Verify typecheck:

```powershell
pnpm --recursive typecheck
```

## Known Limitations

- News and event images are ready in the API/frontend mapping, but no local published news or public event rows exist yet to attach images to.
- Local preview `public_url` values point at `http://localhost:8787/public/media/file/:id`; production uploaded media should use the configured R2 public base URL or a production equivalent media-serving route.
- The local import script is intended for local preview population and should not be used for production without reviewing URL and bucket settings.
