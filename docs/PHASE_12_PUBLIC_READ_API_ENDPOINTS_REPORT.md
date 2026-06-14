# Phase 12 Public Read API Endpoints Report

## Files changed

- `apps/api/src/db/public.ts`
- `apps/api/src/routes/public.ts`
- `docs/PHASE_12_PUBLIC_READ_API_ENDPOINTS_REPORT.md`

No public-site, admin-site, old static HTML/CSS/JS, auth, or admin CRUD files were modified.

## Public endpoints created

Site content:

- `GET /public/home`
- `GET /public/about`
- `GET /public/programs`
- `GET /public/impact`
- `GET /public/contact`
- `GET /public/donate`
- `GET /public/get-involved`
- `GET /public/site-settings`

Collections:

- `GET /public/news`
- `GET /public/news/:slug`
- `GET /public/events`
- `GET /public/events/:slug`
- `GET /public/projects`
- `GET /public/projects/:slug`
- `GET /public/staff`
- `GET /public/partners`

Media:

- `GET /public/media`
- `GET /public/media/:id`

The existing `/public` route now returns a lightweight route index.

## Tables used

- `content_blocks`
- `impact_stats`
- `programs`
- `site_settings`
- `news`
- `events`
- `projects`
- `staff`
- `partners`
- `media_files`

## Filtering rules

- `content_blocks`: only `status = 'published'`
- `impact_stats`: only `status = 'published'`
- `programs`: only `status = 'published'`
- `news`: only `status = 'published'` and `deleted_at IS NULL`
- `events`: only `status IN ('upcoming', 'completed')` and `deleted_at IS NULL`
- `projects`: only `status IN ('active', 'completed')` and `deleted_at IS NULL`
- `staff`: only `status = 'active'` and `deleted_at IS NULL`
- `partners`: only `status = 'active'` and `deleted_at IS NULL`
- `media_files`: only `status = 'active'`
- `site_settings`: returned as public configuration because the table has no status column

Draft, hidden, deleted, archived, cancelled, and admin-only records are excluded where the schema supports that distinction.

## JSON response format

Success:

```json
{
  "ok": true,
  "data": {}
}
```

Error:

```json
{
  "ok": false,
  "error": {
    "message": "Not found"
  }
}
```

Detail endpoints return `404` JSON when the slug or media ID is missing or not publicly visible.

## Media URL behavior

Public media endpoints return safe public fields only:

- `id`
- `public_url`
- `alt_text`
- `caption`
- `mime_type`
- `entity_type`
- `entity_id`
- `display_order`
- `created_at`

Private/internal storage fields such as `storage_key` are not exposed.

Width and height are not returned because the current media schema does not store dimensions.

Important: `/public/media` and `/public/media/:id` use the Phase 11 upgraded media schema from `0003_media_library_updates.sql`. If a local database still only has the legacy `media_files` columns from `0001_initial_schema.sql`, apply the media migration before testing these endpoints.

## Confirmations

- No public-site work was done.
- No admin CRUD changes were made.
- No auth changes were made.
- No hardcoded public content was added.
- No R2 upload behavior was changed.
- No localStorage or sessionStorage usage was added.
- CORS behavior was left unchanged.

## Testing steps

Run typecheck:

```bash
pnpm --recursive typecheck
```

Start the API:

```bash
pnpm --filter api dev
```

Manual API checks:

```bash
curl http://localhost:8787/public/home
curl http://localhost:8787/public/about
curl http://localhost:8787/public/programs
curl http://localhost:8787/public/impact
curl http://localhost:8787/public/news
curl http://localhost:8787/public/projects
curl http://localhost:8787/public/events
curl http://localhost:8787/public/staff
curl http://localhost:8787/public/partners
curl http://localhost:8787/public/media
```

Detail endpoint checks require published/active records with known slugs or IDs:

```bash
curl http://localhost:8787/public/news/example-slug
curl http://localhost:8787/public/projects/example-slug
curl http://localhost:8787/public/events/example-slug
curl http://localhost:8787/public/media/example-id
```

## Known limitations

- Public Next.js pages are not connected yet.
- Media dimensions are not available because the current schema does not store width/height.
- Site settings have no `status` field, so all settings are considered public configuration.
- Events and projects do not use a literal `published` status; public visibility maps to `upcoming/completed` for events and `active/completed` for projects.
- Media endpoints require the Phase 11 media migration if the local database still has the legacy media schema.

## Recommended next phase

In Phase 13, connect the public Next.js website to these read APIs and build public pages from admin-managed content instead of hardcoded real content.
