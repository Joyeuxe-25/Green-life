# Phase 6 D1 Schema Report

Date: 2026-06-06

Scope: reviewed D1 schema files and schema documentation only. No migrations were applied, no Wrangler D1 commands were run, and no backend/auth/R2/admin form work was implemented.

## Files Inspected

- `docs/PHASE_5_CONTENT_MODEL_FORM_PLAN.md`
- `packages/shared/src/constants.ts`
- `apps/api/`

## SQL Files Created

- `apps/api/migrations/0001_initial_schema.sql`
- `apps/api/migrations/README.md`

## Packages Shared Changes

No `packages/shared` changes were needed in Phase 6. Existing shared status constants already align with the SQL CHECK constraints.

## Tables Created In Schema

The migration defines these approved tables:

- `admin`
- `staff`
- `partners`
- `news`
- `events`
- `projects`
- `media_files`
- `contact_messages`
- `donation_messages`

No tables were created for:

- `reports`
- `activity_logs`

## Field Summaries

### `admin`

Purpose: stores the one approved admin user.

Fields:

- `id`: TEXT primary key.
- `name`: admin display name.
- `email`: unique admin email/login identifier.
- `password_hash`: hashed password only, never plain text.
- `password_updated_at`: optional password update timestamp.
- `last_login_at`: optional latest login timestamp.
- `is_active`: boolean-style integer, constrained to `0` or `1`.
- `created_at`: TEXT timestamp.
- `updated_at`: TEXT timestamp.

No real admin password or seed data is included.

### `staff`

Purpose: stores public staff/board profiles.

Fields:

- `id`
- `full_name`
- `role_title`
- `short_bio`
- `email`
- `phone`
- `display_order`
- `status`
- `created_at`
- `updated_at`
- `deleted_at`

### `partners`

Purpose: stores public partner records.

Fields:

- `id`
- `name`
- `slug`
- `website_url`
- `description`
- `display_order`
- `status`
- `is_text_only`
- `created_at`
- `updated_at`
- `deleted_at`

`is_text_only` supports Restore Local until a logo is provided.

### `news`

Purpose: stores public news/blog-style content.

Fields:

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

### `events`

Purpose: stores public event content.

Fields:

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

### `projects`

Purpose: stores public project content.

Fields:

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

Impact metrics are planned inside `impact_summary` as structured text/JSON later. This keeps Phase 6 schema compact while preserving the approved content needs.

### `media_files`

Purpose: shared polymorphic media table for images, videos, logos, and documents.

Fields:

- `id`
- `entity_type`
- `entity_id`
- `file_type`
- `mime_type`
- `original_name`
- `r2_key`
- `file_url`
- `alt_text`
- `caption`
- `is_cover`
- `sort_order`
- `created_at`
- `updated_at`
- `deleted_at`

### `contact_messages`

Purpose: stores public contact form submissions later.

Fields:

- `id`
- `sender_name`
- `email`
- `phone`
- `subject`
- `message`
- `status`
- `created_at`
- `updated_at`
- `deleted_at`

### `donation_messages`

Purpose: stores public donation inquiry messages later.

Fields:

- `id`
- `donor_name`
- `email`
- `phone`
- `intended_amount`
- `message`
- `status`
- `created_at`
- `updated_at`
- `deleted_at`

## Status Values

### Staff And Partners

- `active`
- `hidden`

### News

- `draft`
- `published`
- `archived`

### Events

- `draft`
- `upcoming`
- `completed`
- `cancelled`

### Projects

- `planned`
- `active`
- `completed`

### Contact And Donation Messages

- `new`
- `read`
- `replied`
- `archived`

## CHECK Constraints

The schema uses SQLite/D1-compatible CHECK constraints for:

- Boolean-style integer fields: `is_active`, `is_text_only`, `is_cover`.
- Status fields across staff, partners, news, events, projects, contact messages, and donation messages.
- `media_files.entity_type`: `news`, `event`, `project`, `staff`, `partner`.
- `media_files.file_type`: `image`, `video`, `logo`, `document`.

## Indexes

### Admin

- `idx_admin_is_active`

### Staff

- `idx_staff_status_order`
- `idx_staff_deleted_at`

### Partners

- `idx_partners_status_order`
- `idx_partners_deleted_at`

### News

- `idx_news_status_published_at`
- `idx_news_category`
- `idx_news_deleted_at`

### Events

- `idx_events_status_event_date`
- `idx_events_category`
- `idx_events_deleted_at`

### Projects

- `idx_projects_status`
- `idx_projects_category`
- `idx_projects_district`
- `idx_projects_deleted_at`

### Media Files

- `idx_media_entity`
- `idx_media_entity_cover`
- `idx_media_entity_order`
- `idx_media_file_type`
- `idx_media_deleted_at`

### Contact Messages

- `idx_contact_messages_status_created`
- `idx_contact_messages_email`
- `idx_contact_messages_deleted_at`

### Donation Messages

- `idx_donation_messages_status_created`
- `idx_donation_messages_email`
- `idx_donation_messages_deleted_at`

## Media Files Relationship Explanation

`media_files` uses a polymorphic ownership model:

- `entity_type` identifies the owner table/type.
- `entity_id` stores the owner row ID.

Because one media table supports multiple entity types, `media_files` cannot have one simple foreign key to all owner tables. Relationship integrity must be enforced in API logic later.

Examples:

- Project cover image: `entity_type = 'project'`, `entity_id = projects.id`, `file_type = 'image'`, `is_cover = 1`.
- Project gallery image: `entity_type = 'project'`, `entity_id = projects.id`, `file_type = 'image'`, `is_cover = 0`, ordered by `sort_order`.
- News cover image: `entity_type = 'news'`, `entity_id = news.id`, `file_type = 'image'`, `is_cover = 1`.
- Event video: `entity_type = 'event'`, `entity_id = events.id`, `file_type = 'video'`.
- Staff profile photo: `entity_type = 'staff'`, `entity_id = staff.id`, `file_type = 'image'`, `is_cover = 1`.
- Partner logo: `entity_type = 'partner'`, `entity_id = partners.id`, `file_type = 'logo'`, `is_cover = 1`.

R2 object upload, metadata creation, deletion behavior, and orphan cleanup are intentionally left for later phases.

## Admin Password And Security Notes

- The `admin` table stores `password_hash`, never a plain password.
- No admin seed password was created.
- Admin creation should be handled later through a secure setup script or a manual insert using a properly generated password hash.
- Later authentication must use secure HTTP-only cookies, not localStorage token storage.
- Session secrets must remain backend-only and must never be exposed to frontend code.
- `password_updated_at` exists to support future password rotation/session invalidation behavior.
- `last_login_at` is for account state only and is not an activity log feature.

## Commands For Human To Run Later

Do not run these until migration application is explicitly approved:

```bash
pnpm --filter api wrangler d1 migrations list <DB_NAME>
pnpm --filter api wrangler d1 migrations apply <DB_NAME> --local
pnpm --filter api wrangler d1 migrations apply <DB_NAME> --remote
```

Optional future verification command after install/environment is ready:

```bash
pnpm --filter api typecheck
```

## Warnings

- The migration was not applied locally or remotely.
- No `wrangler d1` commands were run.
- No seed data was created.
- No real admin password exists yet.
- `media_files` polymorphic relationships require API-level validation later.
- `impact_summary` is intentionally flexible; if strict per-metric querying becomes necessary, future migrations may add dedicated metric columns.
- Soft deletes are represented with nullable `deleted_at`; API queries must filter deleted records later.
- Restore Local logo is still missing and should remain text-only until a logo is provided.
- Do not add reports or activity log tables in later phases unless the locked decisions change.
- Do not use `about-team-meeting` in media seed/upload plans.

## Recommended Phase 7

Phase 7 should plan and implement backend API foundations only after approval:

- Add shared database helper utilities.
- Add route grouping structure for public reads and admin-protected writes.
- Add API-level validation for polymorphic media ownership.
- Plan secure admin setup/password hashing.
- Plan HTTP-only cookie auth implementation separately.
- Keep R2 upload implementation, admin forms, and public content migration in later approved phases.

Stop here until Phase 7 is explicitly approved.
