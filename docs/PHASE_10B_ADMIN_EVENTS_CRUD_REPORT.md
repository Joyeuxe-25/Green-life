# Phase 10B Admin Events CRUD Report

## Scope

Phase 10B implemented the second admin content management module: Events. Work stayed within `apps/api`, `apps/admin-site`, and `docs`. No public-site pages, Projects/Staff/Partners CRUD, R2/media upload, migrations, database schema changes, package installation, or auth storage changes were made.

## Files Changed

Backend:

- `apps/api/src/db/events.ts`
- `apps/api/src/routes/admin-events.ts`

Admin site:

- `apps/admin-site/lib/admin-api.ts`
- `apps/admin-site/components/event-form.tsx`
- `apps/admin-site/app/events/page.tsx`
- `apps/admin-site/app/events/add/page.tsx`
- `apps/admin-site/app/events/update/page.tsx`
- `apps/admin-site/app/events/update/[id]/page.tsx`

Documentation:

- `docs/PHASE_10B_ADMIN_EVENTS_CRUD_REPORT.md`

## Schema Fields Used

The existing D1 `events` table was used exactly as defined:

- `id`
- `title`
- `slug`
- `description`
- `event_date`
- `start_time`
- `end_time`
- `location`
- `category`
- `status`
- `created_at`
- `updated_at`
- `deleted_at`

Supported status values:

- `draft`
- `upcoming`
- `completed`
- `cancelled`

## Backend Routes Added

All admin Events routes use the existing `requireAdmin()` middleware and HTTP-only cookie session auth.

- `GET /admin/events`
- `GET /admin/events/:id`
- `POST /admin/events`
- `PATCH /admin/events/:id`
- `DELETE /admin/events/:id`

## Backend Behavior

- Lists non-deleted events ordered by event date and latest update.
- Fetches a single non-deleted event by id.
- Creates an event with a generated UUID.
- Generates a safe slug from title if slug is blank.
- Prevents duplicate slugs on update.
- Validates required `title`, `description`, and `event_date`.
- Validates event date parseability.
- Validates status against schema-supported values.
- Uses parameterized D1 SQL statements.
- Deletes with a soft delete by setting `deleted_at`.
- Returns consistent JSON envelopes through existing response helpers.

## Admin Pages Updated

- `/events`: list view with loading, error, empty state, status/date/location display, edit links, and delete confirmation.
- `/events/add`: create form for title, slug, description, event date, start time, end time, location, category, and status.
- `/events/update`: selection/helper page directing admins back to the events list.
- `/events/update/[id]`: edit form that loads an existing event, saves changes, and redirects to `/events`.

## Admin API Helper

`apps/admin-site/lib/admin-api.ts` now includes:

- `listEvents()`
- `getEventItem()`
- `createEventItem()`
- `updateEventItem()`
- `deleteEventItem()`

All requests continue to use:

```ts
credentials: "include"
```

## Confirmations

- No R2/media upload was implemented.
- No image upload field was added.
- No public-site content migration was done.
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
2. Open `/events`.
3. Create an event from `/events/add`.
4. Confirm it appears in the `/events` list.
5. Open its edit page from the Edit link.
6. Update the title, description, date, location, or status.
7. Confirm the edited event appears in the `/events` list.
8. Delete the event with confirmation.
9. Refresh `/events` and confirm the event remains removed from the list.

## Known Limitations

- The current `events` table has no `cover_image_url` or media field.
- R2 media upload is not ready yet, so images are intentionally excluded.
- Delete behavior is a soft delete using `deleted_at`; there is no restore UI yet.
- The list currently returns up to 100 non-deleted events without pagination UI.
- Search/filtering was not added in this phase.

## Recommended Next Phase

Proceed to one of:

- Phase 10C: Admin Projects CRUD.
- Phase 10C alternative: public read-only API endpoints for published News and Events.

Keep media/R2 upload as a separate later phase.
