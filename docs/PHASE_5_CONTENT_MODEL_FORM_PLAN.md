# Phase 5 Content Model, Admin Form, And Data Mapping Plan

Date: 2026-06-06

Scope: planning and structure only. No SQL schema, backend routes, CRUD endpoints, authentication, cookie sessions, R2 integration, real admin forms, public content migration, package installation, deletion, or commit was performed.

## Files Inspected

- `docs/PHASE_1_CONTENT_MEDIA_AUDIT_REPORT.md`
- `packages/shared/src/constants.ts`
- `packages/shared/src/types.ts`

Phase 1 is the main source for content structure, final impact numbers, partner list, media recommendations, Reports exclusion, and `excluded legacy team meeting image` exclusion.

## Files Changed

- `packages/shared/src/constants.ts`
- `packages/shared/src/types.ts`
- `docs/PHASE_5_CONTENT_MODEL_FORM_PLAN.md`

## Shared Constants And Types Changed

Added lightweight planning constants:

- `PUBLICATION_STATUSES`
- `MESSAGE_STATUSES`
- `PROJECT_STATUSES`
- `EVENT_STATUSES`
- `VISIBILITY_STATUSES`
- `ADMIN_MANAGED_MODULES`

Updated lightweight shared types:

- `PublicationStatus`
- `MessageStatus`
- `ProjectStatus`
- `EventStatus`
- `VisibilityStatus`

No validation schemas, SQL, backend logic, or business logic were added.

## Public Route Content Model

### `/`

- Static content sections: hero, welcome statement, core mission preview, program pillars, impact snapshot, featured projects, partner preview, news/events preview, support CTA.
- Dynamic content needed: latest published news, upcoming events, featured active projects, active partners.
- Media needed: homepage hero image such as `community-seedling-training.avif`; alternate supporting images such as `tree-nursery-landscape.avif`.
- CTA buttons/links: About, Programs, Projects, Impact, Get Involved, Donate.
- Detail pages needed: links to project, news, and event detail pages.

### `/about`

- Static content sections: Who We Are, Mission, Vision, Core Values, History, location/base in Gisagara, founding in 2017, legal registration in 2021.
- Dynamic content needed: optional staff/partner preview if desired.
- Media needed: community and field images such as `nursery-community-work.avif`, `community-listening-session.avif`, `community-nursery-discussion.avif`, `tree-nursery-group.avif`.
- CTA buttons/links: Programs, Partners, Contact, Get Involved.
- Detail pages needed: no required detail pages.

### `/programs`

- Static content sections: Agroforestry Promotion, Climate Action, Youth Environmental Education, Community Livelihoods.
- Dynamic content needed: optional related projects/news/events by category.
- Media needed: program pillar images such as `grevillea-seedlings-for-planting.avif`, `tree-planting-demonstration.avif`, `youth-community-seedling-training.avif`, `livestock-livelihood-support.avif`.
- CTA buttons/links: Projects, Impact, Get Involved, Contact.
- Detail pages needed: no separate program detail pages planned yet.

### `/projects`

- Static content sections: introduction to GLR project approach.
- Dynamic content needed: list of projects from `projects`, with status, summary, district/location, cover image, impact numbers.
- Media needed: project cover images and optional galleries through `media_files`.
- CTA buttons/links: Project details, Programs, Impact, Donate.
- Detail pages needed: yes, `/projects/[slug]`.

### `/projects/[slug]`

- Static content sections: page shell and reusable detail layout.
- Dynamic content needed: one project by unique slug, full description, location, sector, timeline, status, impact metrics, cover/gallery media.
- Media needed: project cover image, gallery images, possibly related field images.
- CTA buttons/links: Back to Projects, Donate, Get Involved, Contact.
- Detail pages needed: this is a detail page.

### `/impact`

- Static content sections: final impact numbers and explanatory context.
- Dynamic content needed: optional featured projects and latest impact-related news.
- Media needed: `farmers-with-grevillea-seedlings.avif`, `community-field-activity.avif`, `tree-nursery-landscape.avif`, `vegetable-garden-farmer.avif`, `fruit-tree-harvest.avif`.
- CTA buttons/links: Projects, Programs, Donate, Get Involved.
- Detail pages needed: links to project/news details if featured.

Final impact numbers:

- 350 smallholder farmers trained in agroforestry and environmental protection.
- 329,425 trees planted across Gisagara and Bugesera Districts.
- 365 hectares of degraded land restored in Gisagara and Rutsiro Districts.
- Permanent tree nurseries established to ensure sustainability.

### `/news`

- Static content sections: news listing intro and category/filter shell.
- Dynamic content needed: published news list, cover image, date, category, excerpt.
- Media needed: news cover images through `media_files`.
- CTA buttons/links: News details, Events, Contact.
- Detail pages needed: yes, `/news/[slug]`.

### `/news/[slug]`

- Static content sections: reusable article detail layout.
- Dynamic content needed: one published news item by unique slug, body/content, category, date, cover/gallery media, optional video.
- Media needed: cover image, gallery images, supporting video if relevant.
- CTA buttons/links: Back to News, Related Projects, Get Involved.
- Detail pages needed: this is a detail page.

### `/events`

- Static content sections: events listing intro and status/category shell.
- Dynamic content needed: upcoming/completed published events, event date, location, category, cover image.
- Media needed: event cover images and optional video/poster through `media_files`.
- CTA buttons/links: Event details, Contact, Get Involved.
- Detail pages needed: yes, `/events/[slug]`.

### `/events/[slug]`

- Static content sections: reusable event detail layout.
- Dynamic content needed: one event by unique slug, date/time, location, description, status, cover/gallery media, optional video.
- Media needed: event cover image, gallery, possible `community-tree-nursery-testimony.mp4` as supporting media.
- CTA buttons/links: Back to Events, Contact, Get Involved.
- Detail pages needed: this is a detail page.

### `/staff`

- Static content sections: staff intro and board/team context.
- Dynamic content needed: active staff members ordered by display order.
- Media needed: staff profile photos through `media_files`; selected AVIF pack has no staff portraits.
- CTA buttons/links: Contact, Get Involved.
- Detail pages needed: no staff detail pages planned.

### `/partners`

- Static content sections: partnership intro and partner recognition.
- Dynamic content needed: active partners ordered by display order.
- Media needed: partner logos through `media_files`; Restore Local text-only until logo is available.
- CTA buttons/links: Contact, Get Involved.
- Detail pages needed: no partner detail pages planned.

Partner names locked/planned:

- World Connect
- Biocoor
- Segal Family Foundation
- Restore Local
- RGB
- Bridge of Hope
- FMI Ubumuntu

### `/donate`

- Static content sections: support statement, donation instructions, donation impact, donation inquiry CTA.
- Dynamic content needed: none required for first build; donation messages submitted later to `donation_messages`.
- Media needed: support/livelihood imagery such as `tree-planting-demonstration.avif` or `livestock-livelihood-support.avif`.
- CTA buttons/links: Contact, Get Involved, Programs.
- Detail pages needed: no.

### `/contact`

- Static content sections: confirmed contact details, location, contact intro, contact message CTA/form later.
- Dynamic content needed: contact form submissions later create `contact_messages`.
- Media needed: community or field-supporting image; do not use `excluded legacy team meeting image`.
- CTA buttons/links: Donate, Programs, Get Involved.
- Detail pages needed: no.

### `/get-involved`

- Static content sections: Support Our Work, Visit GLR, Jobs/Internship/Volunteering, partnership pathway.
- Dynamic content needed: optional featured projects/events; contact message submission later.
- Media needed: `community-nursery-discussion.avif`, `nursery-community-work.avif`, `community-field-meeting.avif`, `tree-planting-demonstration.avif`.
- CTA buttons/links: Contact, Donate, Projects, Programs.
- Detail pages needed: links to projects/events if featured.

## Admin Form Field Plan

### News Add/Update

- `title`: required text.
- `slug`: required unique text, generated from title but editable.
- `excerpt`: required short text.
- `body/content`: required rich text or markdown later.
- `category`: optional text/select.
- `date`: required date, maps to published/display date.
- `status`: required `draft`, `published`, or `archived`.
- `cover image`: optional media selector/upload later.
- `gallery media`: optional multiple media selector/upload later.
- `SEO title`: optional text.
- `SEO description`: optional text.

### Events Add/Update

- `title`: required text.
- `slug`: required unique text, generated from title but editable.
- `description`: required rich text or markdown later.
- `event date`: required date.
- `start time`: optional time.
- `end time`: optional time.
- `location`: optional text.
- `category`: optional text/select.
- `status`: required `draft`, `upcoming`, `completed`, or `cancelled`.
- `cover image`: optional media selector/upload later.
- `gallery media`: optional multiple media selector/upload later.

### Projects Add/Update

- `title`: required text.
- `slug`: required unique text, generated from title but editable.
- `summary`: required short text.
- `description`: required rich text or markdown later.
- `district/location`: optional text.
- `sector`: optional text.
- `start date`: optional date.
- `end date`: optional date.
- `status`: required `planned`, `active`, or `completed`.
- `category`: optional text/select.
- `impact numbers`: optional structured fields such as beneficiaries, trees planted, hectares restored, hectares targeted.
- `cover image`: optional media selector/upload later.
- `gallery media`: optional multiple media selector/upload later.

### Staff Add/Update

- `full name`: required text.
- `role/title`: required text.
- `short bio`: optional text.
- `email if public`: optional email.
- `phone if public`: optional phone.
- `display order`: required number with default.
- `status`: required `active` or `hidden`.
- `profile photo`: optional media selector/upload later.

### Partners Add/Update

- `name`: required text.
- `slug`: required unique text, generated from name but editable.
- `logo`: optional media selector/upload later.
- `website URL`: optional URL.
- `description`: optional text.
- `display order`: required number with default.
- `status`: required `active` or `hidden`.
- `text-only flag`: required boolean, especially for Restore Local until logo is provided.

### Contact Messages

- `sender name`: read-only from submission.
- `email`: read-only from submission.
- `phone`: optional/read-only from submission.
- `subject`: read-only from submission.
- `message`: read-only from submission.
- `status`: admin updateable `new`, `read`, `replied`, or `archived`.
- `created date`: read-only timestamp.

No public-facing contact form is built in this phase.

### Donation Messages

- `donor name`: read-only from submission.
- `email`: read-only from submission.
- `phone`: optional/read-only from submission.
- `intended amount`: optional/read-only from submission.
- `message`: optional/read-only from submission.
- `status`: admin updateable `new`, `read`, `replied`, or `archived`.
- `created date`: read-only timestamp.

No public-facing donation form is built in this phase.

### Change Password

- `current password`: required later.
- `new password`: required later.
- `confirm new password`: required later.
- Valid admin HTTP-only cookie session required later.

No change-password logic or form was built in this phase.

## Database Field Planning

No SQL was created. Types are suggestions for a future D1 schema.

### `admin`

| Field | Type suggestion | Required | Purpose | Likely indexes |
|---|---|---:|---|---|
| `id` | text/uuid | yes | Single admin primary key | primary key |
| `email` | text | yes | Admin login identifier | unique |
| `password_hash` | text | yes | Secure password hash | no |
| `name` | text | optional | Display name | no |
| `created_at` | text/datetime | yes | Creation timestamp | no |
| `updated_at` | text/datetime | yes | Update timestamp | no |
| `last_login_at` | text/datetime | optional | Login audit for account only | no |

### `staff`

| Field | Type suggestion | Required | Purpose | Likely indexes |
|---|---|---:|---|---|
| `id` | text/uuid | yes | Staff primary key | primary key |
| `full_name` | text | yes | Staff name | no |
| `role_title` | text | yes | Public role/title | no |
| `short_bio` | text | optional | Public bio | no |
| `email` | text | optional | Public email if approved | no |
| `phone` | text | optional | Public phone if approved | no |
| `display_order` | integer | yes | Manual ordering | index |
| `status` | text | yes | `active` or `hidden` | index |
| `created_at` | text/datetime | yes | Creation timestamp | no |
| `updated_at` | text/datetime | yes | Update timestamp | no |

### `partners`

| Field | Type suggestion | Required | Purpose | Likely indexes |
|---|---|---:|---|---|
| `id` | text/uuid | yes | Partner primary key | primary key |
| `name` | text | yes | Partner display name | no |
| `slug` | text | yes | URL-safe unique identifier | unique |
| `website_url` | text | optional | Partner website | no |
| `description` | text | optional | Partner description | no |
| `display_order` | integer | yes | Manual ordering | index |
| `status` | text | yes | `active` or `hidden` | index |
| `is_text_only` | integer/boolean | yes | Supports Restore Local without logo | no |
| `created_at` | text/datetime | yes | Creation timestamp | no |
| `updated_at` | text/datetime | yes | Update timestamp | no |

### `news`

| Field | Type suggestion | Required | Purpose | Likely indexes |
|---|---|---:|---|---|
| `id` | text/uuid | yes | News primary key | primary key |
| `title` | text | yes | News title | no |
| `slug` | text | yes | Public URL slug | unique |
| `excerpt` | text | yes | Listing summary | no |
| `content` | text | yes | Body content | no |
| `category` | text | optional | Grouping/filtering | index |
| `published_at` | text/datetime | optional | Publish/display date | index |
| `status` | text | yes | `draft`, `published`, `archived` | index |
| `seo_title` | text | optional | SEO metadata | no |
| `seo_description` | text | optional | SEO metadata | no |
| `created_at` | text/datetime | yes | Creation timestamp | no |
| `updated_at` | text/datetime | yes | Update timestamp | no |

### `events`

| Field | Type suggestion | Required | Purpose | Likely indexes |
|---|---|---:|---|---|
| `id` | text/uuid | yes | Event primary key | primary key |
| `title` | text | yes | Event title | no |
| `slug` | text | yes | Public URL slug | unique |
| `description` | text | yes | Event detail content | no |
| `event_date` | text/date | yes | Event date | index |
| `start_time` | text/time | optional | Start time | no |
| `end_time` | text/time | optional | End time | no |
| `location` | text | optional | Event location | no |
| `category` | text | optional | Grouping/filtering | index |
| `status` | text | yes | `draft`, `upcoming`, `completed`, `cancelled` | index |
| `created_at` | text/datetime | yes | Creation timestamp | no |
| `updated_at` | text/datetime | yes | Update timestamp | no |

### `projects`

| Field | Type suggestion | Required | Purpose | Likely indexes |
|---|---|---:|---|---|
| `id` | text/uuid | yes | Project primary key | primary key |
| `title` | text | yes | Project title | no |
| `slug` | text | yes | Public URL slug | unique |
| `summary` | text | yes | Listing summary | no |
| `description` | text | yes | Full project content | no |
| `district` | text | optional | District/location | index |
| `sector` | text | optional | Sector/location | no |
| `start_date` | text/date | optional | Start date | no |
| `end_date` | text/date | optional | End date | no |
| `status` | text | yes | `planned`, `active`, `completed` | index |
| `category` | text | optional | Grouping/filtering | index |
| `beneficiary_count` | integer | optional | Impact metric | no |
| `trees_planted` | integer | optional | Impact metric | no |
| `hectares_targeted` | real/integer | optional | Impact metric | no |
| `hectares_restored` | real/integer | optional | Impact metric | no |
| `created_at` | text/datetime | yes | Creation timestamp | no |
| `updated_at` | text/datetime | yes | Update timestamp | no |

### `media_files`

| Field | Type suggestion | Required | Purpose | Likely indexes |
|---|---|---:|---|---|
| `id` | text/uuid | yes | Media primary key | primary key |
| `entity_type` | text | yes | Owner type: news/event/project/staff/partner | composite with `entity_id` |
| `entity_id` | text/uuid | yes | Owner row ID | composite with `entity_type` |
| `file_type` | text | yes | image/video/logo/document | index |
| `mime_type` | text | yes | MIME type | no |
| `original_name` | text | yes | Original uploaded filename | no |
| `r2_key` | text | yes | R2 object key | unique |
| `file_url` | text | yes | Public or signed-access URL | no |
| `alt_text` | text | optional | Accessibility text | no |
| `caption` | text | optional | Display caption | no |
| `is_cover` | integer/boolean | yes | Marks cover media | composite with owner |
| `sort_order` | integer | yes | Gallery/display ordering | composite with owner |
| `created_at` | text/datetime | yes | Creation timestamp | no |
| `updated_at` | text/datetime | yes | Update timestamp | no |

### `contact_messages`

| Field | Type suggestion | Required | Purpose | Likely indexes |
|---|---|---:|---|---|
| `id` | text/uuid | yes | Message primary key | primary key |
| `sender_name` | text | yes | Sender name | no |
| `email` | text | yes | Sender email | index |
| `phone` | text | optional | Sender phone | no |
| `subject` | text | optional | Message subject | no |
| `message` | text | yes | Message body | no |
| `status` | text | yes | `new`, `read`, `replied`, `archived` | index |
| `created_at` | text/datetime | yes | Submission timestamp | index |
| `updated_at` | text/datetime | yes | Admin status update timestamp | no |

### `donation_messages`

| Field | Type suggestion | Required | Purpose | Likely indexes |
|---|---|---:|---|---|
| `id` | text/uuid | yes | Donation message primary key | primary key |
| `donor_name` | text | yes | Donor name | no |
| `email` | text | yes | Donor email | index |
| `phone` | text | optional | Donor phone | no |
| `intended_amount` | text/integer | optional | Intended amount, exact storage to confirm | no |
| `message` | text | optional | Donor message | no |
| `status` | text | yes | `new`, `read`, `replied`, `archived` | index |
| `created_at` | text/datetime | yes | Submission timestamp | index |
| `updated_at` | text/datetime | yes | Admin status update timestamp | no |

## Media Files Relationship Plan

Use one shared `media_files` table for all managed media. Ownership is represented by `entity_type` and `entity_id`.

Examples:

- Project cover image: `entity_type = project`, `entity_id = project.id`, `file_type = image`, `is_cover = true`.
- Project gallery images: `entity_type = project`, `entity_id = project.id`, `file_type = image`, `is_cover = false`, ordered by `sort_order`.
- News cover image: `entity_type = news`, `entity_id = news.id`, `file_type = image`, `is_cover = true`.
- Event video: `entity_type = event`, `entity_id = event.id`, `file_type = video`, with a separate poster image as cover or gallery media.
- Staff profile photo: `entity_type = staff`, `entity_id = staff.id`, `file_type = image`, `is_cover = true`.
- Partner logo: `entity_type = partner`, `entity_id = partner.id`, `file_type = logo`, `is_cover = true`.

Media guidance:

- The video `community-tree-nursery-testimony.mp4` should be supporting media only, not homepage hero media.
- Restore Local can be stored as a partner row with `is_text_only = true` until a logo is provided.
- Do not use `excluded legacy team meeting image` or related source media anywhere in the future system.

## Status Rules

### Published Content

- `draft`: visible only in admin later.
- `published`: visible on public site.
- `archived`: retained in admin, hidden from public listings and detail routes unless future policy says otherwise.

Applies to:

- News

### Events

- `draft`: admin-only.
- `upcoming`: public listing/detail visible.
- `completed`: public listing/detail visible if retained as past event.
- `cancelled`: public visibility optional; recommended hidden from primary listing unless clearly marked.

### Projects

- `planned`: may be public if GLR wants to show future projects.
- `active`: public and emphasized.
- `completed`: public and available for impact/history.

### Staff And Partners

- `active`: visible publicly.
- `hidden`: retained in admin, hidden publicly.

### Messages

- `new`: unread or not yet triaged.
- `read`: reviewed by admin.
- `replied`: response completed.
- `archived`: retained but out of active queue.

## Slug Rules

- Slugs are required for public detail content: news, events, projects, partners if partner detail URLs are ever added.
- Slugs should be lowercase, hyphen-separated, and ASCII where possible.
- Generate initial slug from title/name.
- Allow admin to edit before saving.
- Slugs must be unique within their table.
- Preserve existing slug after publication unless the admin intentionally changes it.
- If a slug changes later, a redirect strategy should be planned before deployment.
- Avoid date-only or generic slugs such as `project`, `news`, or `event`.

## Exclusions Preserved

- No reports feature.
- No reports table.
- No activity logs table.
- `reports.html` remains in the old static site but is excluded from future rebuild scope.
- `excluded legacy team meeting image` must not be used.
- Admin authentication will use HTTP-only cookies later, not localStorage.

## Warnings

- This report is not a database schema and should not be copied directly as SQL.
- Contact and donation details are confirmed according to project status, but exact production form copy and routing still need approval before implementation.
- Restore Local logo is still missing; partner should remain text-only until provided.
- Staff portraits were not included in the selected AVIF pack.
- Blog is mentioned in the source content but no `blog` table is approved; blog-like content should be handled as News unless the scope changes.
- Jobs/Internship/Volunteering is mentioned in content but no jobs table is approved; handle through Get Involved and Contact Messages unless scope changes.

## Recommended Phase 6

Phase 6 should prepare the database and API implementation plan before coding:

- Convert this field plan into a reviewed D1 SQL schema proposal.
- Plan migrations without applying them yet unless approved.
- Plan Hono route groups for public read endpoints and admin protected endpoints.
- Plan cookie-session auth flow in detail, still without implementation unless approved.
- Plan R2 upload and media metadata workflow.

Stop here until Phase 6 is explicitly approved.
