# Phase 10G Admin Site Content Management Report

## Files changed

- `apps/api/migrations/0002_site_content_management.sql`
- `apps/api/src/db/content-blocks.ts`
- `apps/api/src/db/impact-stats.ts`
- `apps/api/src/db/programs.ts`
- `apps/api/src/db/site-settings.ts`
- `apps/api/src/routes/admin-content-blocks.ts`
- `apps/api/src/routes/admin-impact-stats.ts`
- `apps/api/src/routes/admin-programs.ts`
- `apps/api/src/routes/admin-site-settings.ts`
- `apps/api/src/index.ts`
- `apps/admin-site/lib/admin-api.ts`
- `apps/admin-site/components/content-block-form.tsx`
- `apps/admin-site/components/impact-stat-form.tsx`
- `apps/admin-site/components/program-form.tsx`
- `apps/admin-site/components/site-setting-form.tsx`
- `apps/admin-site/components/admin-sidebar.tsx`
- `apps/admin-site/app/site-content/page.tsx`
- `apps/admin-site/app/site-content/add/page.tsx`
- `apps/admin-site/app/site-content/update/page.tsx`
- `apps/admin-site/app/site-content/update/[id]/page.tsx`
- `apps/admin-site/app/impact-stats/page.tsx`
- `apps/admin-site/app/impact-stats/add/page.tsx`
- `apps/admin-site/app/impact-stats/update/page.tsx`
- `apps/admin-site/app/impact-stats/update/[id]/page.tsx`
- `apps/admin-site/app/programs/page.tsx`
- `apps/admin-site/app/programs/add/page.tsx`
- `apps/admin-site/app/programs/update/page.tsx`
- `apps/admin-site/app/programs/update/[id]/page.tsx`
- `apps/admin-site/app/site-settings/page.tsx`
- `apps/admin-site/app/site-settings/add/page.tsx`
- `apps/admin-site/app/site-settings/update/page.tsx`
- `apps/admin-site/app/site-settings/update/[key]/page.tsx`
- `docs/PHASE_10G_ADMIN_SITE_CONTENT_MANAGEMENT_REPORT.md`

## Migration created

Created `apps/api/migrations/0002_site_content_management.sql`.

The migration was not applied automatically.

## Tables created

- `content_blocks`
- `impact_stats`
- `programs`
- `site_settings`

Indexes were added for common admin/public lookup patterns, including content block page/order, impact/program status order, program slug, and site setting group.

No `reports` table, activity logs table, or Green Life Rwanda seed content was added.

## Backend routes added

Content Blocks:

- `GET /admin/content-blocks`
- `GET /admin/content-blocks/:id`
- `POST /admin/content-blocks`
- `PATCH /admin/content-blocks/:id`
- `DELETE /admin/content-blocks/:id`

Impact Stats:

- `GET /admin/impact-stats`
- `GET /admin/impact-stats/:id`
- `POST /admin/impact-stats`
- `PATCH /admin/impact-stats/:id`
- `DELETE /admin/impact-stats/:id`

Programs:

- `GET /admin/programs`
- `GET /admin/programs/:id`
- `POST /admin/programs`
- `PATCH /admin/programs/:id`
- `DELETE /admin/programs/:id`

Site Settings:

- `GET /admin/site-settings`
- `GET /admin/site-settings/:key`
- `POST /admin/site-settings`
- `PATCH /admin/site-settings/:key`
- `DELETE /admin/site-settings/:key`

All routes use the existing `requireAdmin` middleware and existing JSON envelope helpers.

## Admin pages added

- `/site-content`
- `/site-content/add`
- `/site-content/update`
- `/site-content/update/[id]`
- `/impact-stats`
- `/impact-stats/add`
- `/impact-stats/update`
- `/impact-stats/update/[id]`
- `/programs`
- `/programs/add`
- `/programs/update`
- `/programs/update/[id]`
- `/site-settings`
- `/site-settings/add`
- `/site-settings/update`
- `/site-settings/update/[key]`

The admin sidebar now includes a `Website Content` group with links for Site Content, Programs, Impact Stats, and Site Settings.

## Validation rules

- `content_blocks` requires `page_key`, `block_key`, and `block_type`.
- `impact_stats` requires `label` and `value`.
- `programs` requires `title`; slug is generated when missing.
- `site_settings` requires `key` and `label`.
- Status-bearing modules only accept `draft` or `published`.
- Not-found records return clean 404 responses.

## Confirmations

- No public-site work was done.
- No R2 or media upload work was done.
- No enhanced images or generated website mockup were used.
- No hardcoded public website content was added.
- No auth storage or token storage changes were made.
- No migration was applied automatically.

## Manual migration and testing steps

The configured D1 database name in `apps/api/wrangler.jsonc` is `green-life-rwanda`.

Apply locally only when ready:

```bash
pnpm --filter api wrangler d1 migrations apply green-life-rwanda --local
```

Run verification:

```bash
pnpm --recursive typecheck
pnpm dev:api
pnpm dev:admin
```

Manual browser testing:

- Log in to the admin site.
- Open `/site-content`.
- Create, edit, and delete a content block.
- Open `/impact-stats`.
- Create, edit, and delete an impact stat.
- Open `/programs`.
- Create, edit, and delete a program.
- Open `/site-settings`.
- Create, edit, and delete a setting.

## Known limitations

- Public Next.js pages are not connected to these APIs yet.
- No public read routes were added in this phase.
- No media upload exists; image fields are URL text fields only.
- The new tables must be migrated locally or in staging before browser CRUD testing can succeed against D1.
- Site setting keys should avoid slashes because keys are used in route paths.

## Recommended next phase

Apply the migration in local/staging, complete manual CRUD testing, then add public read APIs and connect the future public Next.js redesign to these admin-managed content sources.
