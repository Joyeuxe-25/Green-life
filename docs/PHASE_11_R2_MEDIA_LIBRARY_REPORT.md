# Phase 11 R2 Media Library Report

## Files changed

- `apps/api/migrations/0003_media_library_updates.sql`
- `apps/api/src/types.ts`
- `apps/api/.dev.vars.example`
- `apps/api/wrangler.jsonc`
- `apps/api/src/utils/media.ts`
- `apps/api/src/db/media.ts`
- `apps/api/src/routes/admin-media.ts`
- `apps/api/src/index.ts`
- `apps/admin-site/lib/admin-api.ts`
- `apps/admin-site/app/media/page.tsx`
- `apps/admin-site/components/admin-sidebar.tsx`
- `docs/PHASE_11_R2_MEDIA_LIBRARY_REPORT.md`

## Media schema used

The existing `media_files` table in `0001_initial_schema.sql` was inspected. It already had useful fields such as `id`, `entity_type`, `entity_id`, `mime_type`, `original_name`, `r2_key`, `file_url`, `alt_text`, `caption`, `sort_order`, timestamps, and `deleted_at`.

However, the existing table was too constrained for Phase 11 because:

- `entity_type` and `entity_id` were required, but media uploads need to support unattached files.
- `entity_type` did not allow future site-content usage.
- There was no `size_bytes` field for the media library UI.
- There was no simple active/hidden/deleted `status` field.
- Column names differed from the preferred media library shape.

## Migration created

Created `apps/api/migrations/0003_media_library_updates.sql`.

The migration upgrades `media_files` to:

- `id`
- `original_name`
- `file_name`
- `mime_type`
- `size_bytes`
- `storage_key`
- `public_url`
- `alt_text`
- `caption`
- `entity_type`
- `entity_id`
- `display_order`
- `status`
- `created_at`
- `updated_at`

It preserves compatible legacy rows, maps `r2_key` to `storage_key`, maps `file_url` to `public_url`, maps `sort_order` to `display_order`, and maps deleted rows to `status = 'deleted'`.

The migration was not applied automatically.

## R2 binding and environment

R2 binding name:

- `MEDIA_BUCKET`

Environment variable:

- `R2_PUBLIC_BASE_URL`

Example value only:

```bash
R2_PUBLIC_BASE_URL=https://media.greenliferwanda.org
```

`apps/api/wrangler.jsonc` already had the R2 bucket binding and now includes an example `R2_PUBLIC_BASE_URL` var. No real secrets were added.

## Backend routes added

Admin-protected routes:

- `GET /admin/media`
- `GET /admin/media/:id`
- `POST /admin/media/upload`
- `PATCH /admin/media/:id`
- `DELETE /admin/media/:id`

`GET /admin/media` supports:

- `entity_type`
- `entity_id`
- `status`
- `q` or `search`

All routes use the existing `requireAdmin` middleware and JSON response helpers.

## Admin media page

Added:

- `/media`

The page includes:

- upload form
- file input
- alt text
- caption
- entity type
- entity ID
- display order
- upload button
- loading, error, and success states
- media grid
- thumbnail preview when `public_url` exists
- file name, MIME type, and size
- inline metadata editing
- copy URL button when `public_url` exists
- delete button with confirmation
- empty state

## File validation

Allowed file types:

- `image/avif`
- `image/jpeg`
- `image/png`
- `image/webp`

Maximum image size:

- 8 MB

Video upload was intentionally skipped for this phase and can be added later.

## Enhanced image upload plan

The enhanced AVIF media pack should be kept outside git and uploaded through the admin media library later.

Expected local placement by a human:

- `00_INPUTS/05_enhanced_avif_media/`

Or extract from:

- `Green_Life_Rwanda_Enhanced_AVIF_Media.zip`

Manual process:

1. Start the API and admin site.
2. Log in to admin.
3. Open `/media`.
4. Upload enhanced AVIF images one by one or in a later bulk-upload phase.
5. Fill useful alt text and captions.
6. Later attach/select uploaded media for content blocks, news, events, projects, staff, partners, and public dynamic pages.

The enhanced images were not uploaded automatically and were not hardcoded into any public page.

## Confirmations

- No public-site work was done.
- No old static HTML, CSS, or JS files were modified.
- No enhanced images were hardcoded.
- No enhanced images were uploaded automatically.
- No auth storage changes were made.
- No localStorage or sessionStorage was used for auth.
- No reports table or activity logs table was created.
- No seed media was inserted.

## Local testing steps

Apply the migration locally when ready:

```bash
pnpm --filter api wrangler d1 migrations apply green-life-rwanda --local
```

Run typecheck:

```bash
pnpm --recursive typecheck
```

Start services:

```bash
pnpm --filter api dev
pnpm --filter admin-site dev
```

Manual browser testing:

- Log in to the admin site.
- Open `/media`.
- Upload a small test AVIF, JPG, PNG, or WebP.
- Confirm it appears in the media library.
- Edit alt text and caption.
- Copy URL if `R2_PUBLIC_BASE_URL` is configured and local R2 returns usable object access.
- Delete the test media.

## Production setup notes

- Replace `REPLACE_WITH_D1_DATABASE_ID` in Wrangler config before production deploy.
- Confirm the `green-life-rwanda-media` R2 bucket exists.
- Configure `R2_PUBLIC_BASE_URL` to the final public media domain.
- Ensure the public media domain can serve objects for `public_url` values.
- Apply migrations to the intended D1 database before using the media library.

## Known limitations

- Public website pages are not connected to media yet.
- No public media selection widgets were added to content/news/event/project/staff/partner forms yet.
- Upload is one file at a time.
- Video upload is not included.
- Deleting media attempts to delete from R2 and marks the D1 record as `deleted`.
- Local preview depends on `R2_PUBLIC_BASE_URL`; without it, uploaded media can still be stored but thumbnails may not render from a public URL.

## Recommended next phase

Apply the media migration locally/staging, manually verify upload/edit/delete, then add reusable media picker controls to content blocks and existing admin CRUD forms.
