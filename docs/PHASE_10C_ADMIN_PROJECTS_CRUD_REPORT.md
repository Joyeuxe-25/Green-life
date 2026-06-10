# Phase 10C Admin Projects CRUD Report

## Scope

Phase 10C implemented the third admin content management module: Projects. Work stayed within `apps/api`, `apps/admin-site`, and `docs`. No public-site pages, Staff CRUD, Partners CRUD, R2/media upload, migrations, database schema changes, package installation, or auth storage changes were made.

## Files Changed

Backend:

- `apps/api/src/db/projects.ts`
- `apps/api/src/routes/admin-projects.ts`

Admin site:

- `apps/admin-site/lib/admin-api.ts`
- `apps/admin-site/components/project-form.tsx`
- `apps/admin-site/app/projects/page.tsx`
- `apps/admin-site/app/projects/add/page.tsx`
- `apps/admin-site/app/projects/update/page.tsx`
- `apps/admin-site/app/projects/update/[id]/page.tsx`

Documentation:

- `docs/PHASE_10C_ADMIN_PROJECTS_CRUD_REPORT.md`

## Schema Fields Used

The existing D1 `projects` table was used exactly as defined:

- `id`
- `title`
- `slug`
- `summary`
- `description`
- `district`
- `sector`
- `start_date`
- `end_date`
- `status`
- `category`
- `impact_summary`
- `created_at`
- `updated_at`
- `deleted_at`

Supported status values:

- `planned`
- `active`
- `completed`

## Backend Routes Added

All admin Projects routes use the existing `requireAdmin()` middleware and HTTP-only cookie session auth.

- `GET /admin/projects`
- `GET /admin/projects/:id`
- `POST /admin/projects`
- `PATCH /admin/projects/:id`
- `DELETE /admin/projects/:id`

## Backend Behavior

- Lists non-deleted projects ordered by latest update/create time.
- Fetches a single non-deleted project by id.
- Creates a project with a generated UUID.
- Generates a safe slug from title if slug is blank.
- Prevents duplicate slugs on update.
- Validates required `title`, `summary`, and `description`.
- Validates project status against schema-supported values.
- Validates that end date is not before start date when both are present.
- Uses parameterized D1 SQL statements.
- Deletes with a soft delete by setting `deleted_at`.
- Returns consistent JSON envelopes through existing response helpers.

## Admin Pages Updated

- `/projects`: list view with loading, error, empty state, status/location/date display, edit links, and delete confirmation.
- `/projects/add`: create form for title, slug, summary, description, district, sector, start date, end date, status, category, and impact summary.
- `/projects/update`: selection/helper page directing admins back to the projects list.
- `/projects/update/[id]`: edit form that loads an existing project, saves changes, and redirects to `/projects`.

## Admin API Helper

`apps/admin-site/lib/admin-api.ts` now includes:

- `listProjects()`
- `getProjectItem()`
- `createProjectItem()`
- `updateProjectItem()`
- `deleteProjectItem()`

All requests continue to use:

```ts
credentials: "include"
```

## Confirmations

- No R2/media upload was implemented.
- No image upload field was added.
- No public-site content migration was done.
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
2. Open `/projects`.
3. Create a project from `/projects/add`.
4. Confirm it appears in the `/projects` list.
5. Open its edit page from the Edit link.
6. Update the title, summary, description, location, dates, status, or impact summary.
7. Confirm the edited project appears in the `/projects` list.
8. Delete the project with confirmation.
9. Refresh `/projects` and confirm the project remains removed from the list.

## Known Limitations

- The current `projects` table has no `cover_image_url` or media field.
- R2 media upload is not ready yet, so images are intentionally excluded.
- Delete behavior is a soft delete using `deleted_at`; there is no restore UI yet.
- The list currently returns up to 100 non-deleted projects without pagination UI.
- Search/filtering was not added in this phase.

## Recommended Next Phase

Proceed to one of:

- Phase 10D: Admin Staff CRUD.
- Phase 10D alternative: Admin Partners CRUD.

Keep media/R2 upload as a separate later phase.
