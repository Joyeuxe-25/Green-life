# Phase 15O Admin Site Upgrade Report

## Scope

Phase 15O upgraded the admin dashboard only. Work stayed in:

- `apps/admin-site`
- `apps/api` database row mapping for News/Event/Project media metadata
- `docs`

No public-site files were changed for this phase.

## Files Changed

- `apps/admin-site/app/layout.tsx`
- `apps/admin-site/app/login/page.tsx`
- `apps/admin-site/app/news/add/page.tsx`
- `apps/admin-site/app/news/update/[id]/page.tsx`
- `apps/admin-site/app/events/add/page.tsx`
- `apps/admin-site/app/events/update/[id]/page.tsx`
- `apps/admin-site/app/projects/add/page.tsx`
- `apps/admin-site/app/projects/update/[id]/page.tsx`
- `apps/admin-site/components/admin-live-time.tsx`
- `apps/admin-site/components/admin-navbar.tsx`
- `apps/admin-site/components/admin-profile-menu.tsx`
- `apps/admin-site/components/admin-shell.tsx`
- `apps/admin-site/components/admin-sidebar.tsx`
- `apps/admin-site/components/entity-image-field.tsx`
- `apps/admin-site/components/news-form.tsx`
- `apps/admin-site/components/event-form.tsx`
- `apps/admin-site/components/project-form.tsx`
- `apps/admin-site/lib/admin-api.ts`
- `apps/admin-site/lib/admin-brand-assets.ts`
- `apps/api/src/db/news.ts`
- `apps/api/src/db/events.ts`
- `apps/api/src/db/projects.ts`
- `docs/PHASE_15O_ADMIN_SITE_UPGRADE_REPORT.md`

## Admin Logo And Favicon

- Processed logo/favicon assets were present under `00_INPUTS/06_green_life_logo/processed/`.
- Admin logo uses the existing media URL for `media-green-life-logo-transparent-webp`.
- Admin favicon metadata uses existing media URLs for `.ico`, 32px PNG, and apple touch icon.
- No raw JPEG logo was used.
- No ISOKO logo, fake logo, or generated logo was used.
- No logo or favicon image was copied into `apps/admin-site`.

## News/Event/Project Upload Support

- News, Events, and Projects create/update forms now include a feature image upload area.
- The upload field accepts AVIF, JPEG, PNG, and WebP only.
- Client-side validation rejects unsupported types and files larger than 8 MB.
- Update forms show the current attached image preview when present.
- Update forms allow replacing or removing the attached image.
- Save buttons show a loading message when syncing image changes.

## Media/R2 Attachment Behavior

- Images are uploaded through the existing admin media upload API.
- Images are not stored as base64 in D1.
- Images are not copied into `apps/admin-site`.
- Create flow:
  - create the News/Event/Project row first
  - upload the selected image through media
  - attach it using `media_files.entity_type` and `media_files.entity_id`
- Update flow:
  - update the row JSON payload without the file object
  - replace existing active media when a new file is selected
  - delete existing active media when remove image is selected
- Entity types used:
  - `news`
  - `event`
  - `project`
- Admin API row mapping now returns first active attached media as `image_url`, `image_alt_text`, and `image_caption`.

## Sidebar Dropdowns

- Sidebar was shortened to module-first navigation.
- News, Events, Projects, Staff, and Partners now expose dropdown children only when opened.
- Dropdown children use:
  - `Update`
  - `Add New`
- The required dropdowns do not use `All`.
- Active routes are highlighted.
- Dropdown state is visually indicated with chevrons.

## Sidebar Collapse

- Desktop/laptop sidebar can now collapse.
- Expanded mode shows icons and text.
- Collapsed mode shows icons only.
- Main content grid adjusts between expanded and collapsed sidebar widths.
- Mobile still uses an overlay sidebar.

## Navbar Time

- Admin navbar now shows live date/time.
- Time updates every 30 seconds.
- Time is initialized client-side to avoid hydration mismatches.

## Profile Menu

- Profile menu was added to the navbar right corner.
- Profile access was added to the bottom of the sidebar.
- Menu shows admin name/email and a role fallback of `Administrator`.
- Existing safe `GET /admin/auth/me` data is used; no sensitive fields are exposed.
- Change Password was moved into the profile menu.
- Logout is available from the profile menu with a logout icon.
- Profile menu closes on outside click and Escape.

## UI Polish

- Admin forms now have a clearer media upload area.
- Admin shell spacing and sidebar behavior were tightened.
- Buttons and menu controls remain aligned with Green Life Rwanda colors.
- The layout remains light/professional rather than overly dark.

## Testing

Command run:

```bash
pnpm --recursive typecheck
```

Result:

- Initial sandboxed run failed with a `fetch failed` pnpm error.
- Escalated rerun completed successfully.
- `apps/admin-site`, `apps/api`, `apps/public-site`, and `packages/shared` all passed `tsc --noEmit`.

Manual QA:

- Static/code QA completed for:
  - admin login logo wiring
  - favicon metadata wiring
  - sidebar dropdown labels and ordering
  - collapsed/expanded sidebar code paths
  - navbar time component
  - profile menu code paths
  - News/Event/Project image add/update/remove flows
  - media entity attachment behavior
- Browser QA was attempted, but the local admin dev server did not bind successfully on an alternate port in this environment. Port 3000 was already serving another app, and repeated admin dev-server starts exited without producing a usable admin route. Full interactive checks should be repeated in a local session where `apps/admin-site` can be served.

## Confirmations

- No public-site changes were made for Phase 15O.
- No public website design was changed.
- No auth security logic was changed.
- No real public content was hardcoded in React pages.
- No raw JPEG logo was used.
- No fake logo/favicon was used.
- No images/logos were copied into `apps/admin-site`.
- No uploaded images are stored as base64 in D1.
- No commit was made.
