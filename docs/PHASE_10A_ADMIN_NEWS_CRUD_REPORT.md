# Phase 10A Admin News CRUD Report

## Scope

Phase 10A implemented the first real admin content management module: News. Work stayed within `apps/api`, `apps/admin-site`, and `docs`. No public-site pages, Events/Projects/Staff/Partners CRUD, R2/media upload, migrations, database schema changes, or auth storage changes were made.

## Files Changed

Backend:

- `apps/api/src/db/news.ts`
- `apps/api/src/routes/admin-news.ts`

Admin site:

- `apps/admin-site/lib/admin-api.ts`
- `apps/admin-site/components/news-form.tsx`
- `apps/admin-site/app/news/page.tsx`
- `apps/admin-site/app/news/add/page.tsx`
- `apps/admin-site/app/news/update/page.tsx`
- `apps/admin-site/app/news/update/[id]/page.tsx`

Documentation:

- `docs/PHASE_10A_ADMIN_NEWS_CRUD_REPORT.md`

## Schema Fields Used

The existing D1 `news` table was used exactly as defined:

- `id`
- `title`
- `slug`
- `excerpt`
- `content`
- `category`
- `published_at`
- `status`
- `seo_title`
- `seo_description`
- `created_at`
- `updated_at`
- `deleted_at`

Supported status values:

- `draft`
- `published`
- `archived`

## Backend Routes Added

All admin News routes use the existing `requireAdmin()` middleware and HTTP-only cookie session auth.

- `GET /admin/news`
- `GET /admin/news/:id`
- `POST /admin/news`
- `PATCH /admin/news/:id`
- `DELETE /admin/news/:id`

## Backend Behavior

- Lists non-deleted news items ordered by latest update/create time.
- Fetches a single non-deleted news item by id.
- Creates a news item with generated UUID.
- Generates a safe slug from title if slug is blank.
- Prevents duplicate slugs on update.
- Validates required `title`, `excerpt`, and `content`.
- Validates status against the schema-supported values.
- Uses parameterized D1 SQL statements.
- Deletes with a soft delete by setting `deleted_at`.
- Returns consistent JSON envelopes through existing response helpers.

## Admin Pages Updated

- `/news`: list view with loading, error, empty state, status/date display, edit links, and delete confirmation.
- `/news/add`: create form for title, slug, excerpt, content, category, status, published date, SEO title, and SEO description.
- `/news/update`: selection/helper page directing admins back to the news list.
- `/news/update/[id]`: edit form that loads an existing item, saves changes, and redirects to `/news`.

## Admin API Helper

`apps/admin-site/lib/admin-api.ts` now includes:

- `listNews()`
- `getNewsItem()`
- `createNewsItem()`
- `updateNewsItem()`
- `deleteNewsItem()`

All requests continue to use:

```ts
credentials: "include"
```

## Confirmations

- No R2/media upload was implemented.
- No image upload field was added.
- No public-site content migration was done.
- No Events CRUD was implemented.
- No Projects CRUD was implemented.
- No Staff CRUD was implemented.
- No Partners CRUD was implemented.
- No migrations were added or applied.
- No localStorage or sessionStorage auth storage was added.
- No admin auth logic was changed beyond using the existing `requireAdmin()` middleware.

## Testing Completed

Typecheck passed:

```powershell
pnpm --recursive typecheck
```

## Manual Test Steps

Start the API:

```powershell
pnpm --filter api dev
```

Start the admin site:

```powershell
pnpm --filter admin-site dev
```

Then:

1. Log in with the local admin account.
2. Open `/news`.
3. Create a draft news item from `/news/add`.
4. Confirm it appears in the `/news` list.
5. Open its edit page from the Edit link.
6. Update the title, excerpt, content, status, or published date.
7. Confirm the edited item appears in the `/news` list.
8. Delete the item with confirmation.
9. Refresh `/news` and confirm the item remains removed from the list.

## Known Limitations

- The current `news` table has no `cover_image_url` column.
- R2 media upload is not ready yet, so images are intentionally excluded.
- Delete behavior is a soft delete using `deleted_at`; there is no restore UI yet.
- The list currently returns up to 100 non-deleted items without pagination UI.
- Search/filtering was not added in this phase.

## Recommended Next Phase

Proceed to one of:

- Phase 10B: Admin Events CRUD.
- Phase 10B alternative: public read-only API endpoints for published News only.

Keep media/R2 upload as a separate later phase.
