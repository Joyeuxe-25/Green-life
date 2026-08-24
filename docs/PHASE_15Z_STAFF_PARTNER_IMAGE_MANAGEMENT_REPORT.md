# Phase 15Z — Staff & Partner Image Management

End-to-end image/logo management for **Staff** and **Partners**, wired through the
existing media library and R2 storage. No new bucket, table, upload service, or media
API was introduced — the feature reuses the existing `media_files` association model
(`entity_type` + `entity_id`).

---

## 1. Where Codex stopped

Codex had implemented almost the entire feature but left the work **uncommitted** and
**broken at the point of the limit**: the two admin *update* pages had their leading
imports accidentally deleted while the media-API imports were being merged into the
existing import block.

- `apps/admin-site/app/staff/update/[id]/page.tsx`
- `apps/admin-site/app/partners/update/[id]/page.tsx`

Both files referenced `useRouter`, `useParams`, `useState`, `useEffect`, `AdminShell`,
and `StaffForm` / `PartnerForm` but no longer imported them — a hard TypeScript/build
failure. No report and no migration had been created.

## 2. What was already implemented (by Codex, preserved)

| Area | Status |
|------|--------|
| Media relationship (reuse `media_files` entity_type/entity_id) | ✅ |
| API — staff `image_*` columns via correlated subselect (`db/staff.ts`) | ✅ |
| API — partner `logo_*` columns via correlated subselect (`db/partners.ts`) | ✅ |
| API — public staff uses `withAttachedMediaColumns("staff","staff",…)` (`db/public.ts`) | ✅ |
| API — public partner logo (pre-existing) | ✅ |
| Admin — generic `EntityImageField` (label/description/previewAlt props) | ✅ |
| Admin — Staff & Partner forms wired with upload + preview | ✅ |
| Admin — add pages upload image after create | ✅ |
| Admin — list pages show thumbnails with fallbacks | ✅ |
| Admin API — `replaceEntityImage` / `removeEntityImages` extended to `staff`/`partner`, switched to soft-hide instead of hard delete | ✅ |
| Public — `StaffCard` renders profile image with icon fallback | ✅ |
| Public — `PartnerCard` renders logo (pre-existing) | ✅ |
| Types — admin + public image/logo fields | ✅ |

## 3. What I completed

- **Restored the deleted imports** in both admin update pages, unblocking the build.
  The rest of each file (already written by Codex) was preserved unchanged.
- Verified the entire data flow end-to-end by code inspection:
  admin form → `create/updateStaffItem|PartnerItem` → `replaceEntityImage` /
  `removeEntityImages` → `/admin/media/upload` (auth + validation) → `media_files`
  association → API correlated subselect → public API type → `StaffCard` / `PartnerCard`.
- Confirmed `createStaff/updateStaff` (and partner equivalents) use plain
  `INSERT`/`UPDATE` followed by a normal `SELECT` (`findStaffById` / `findPartnerById`),
  so the media subselects run in a regular query — **no unsupported subquery-in-RETURNING**.
- Ran `tsc --noEmit` on all three apps — **all pass**.

## 4. Database changes

**None required.** After migration `0003_media_library_updates.sql`, `media_files.entity_type`
is a plain `TEXT` column with no CHECK constraint, so it already accepts `'staff'` and
`'partner'`. (The original `0001` CHECK also already listed both.) The association is
`media_files.entity_type` + `media_files.entity_id` → staff/partner `id`.

**No new migration was created and none is needed.**

## 5. Backend / API changes

- `apps/api/src/db/staff.ts` — `STAFF_COLUMNS` adds `image_url` / `image_alt_text` /
  `image_caption` via correlated subselect over `media_files` (status = 'active',
  ordered by display_order then created_at, LIMIT 1). `StaffRow` type extended.
- `apps/api/src/db/partners.ts` — same for `logo_url` / `logo_alt_text` / `logo_caption`.
- `apps/api/src/db/public.ts` — public staff columns now built with
  `withAttachedMediaColumns("staff","staff",…)`; `PublicStaffMember` type extended.
  (Public partner already attached its logo.)

## 6. R2 / media changes

- Reuses existing R2 + media library end-to-end. No new bucket / service / table / API.
- `replaceEntityImage` / `removeEntityImages` (admin-api) now accept `staff` and
  `partner`, and **soft-hide** superseded media (`status: 'hidden'`) instead of hard
  deleting — avoids orphaning/deleting shared media while keeping the active subselect
  returning only the current image.
- Upload validation is the existing rule set (`apps/api/src/utils/media.ts`):
  allowed MIME `image/avif|jpeg|png|webp`, max **8 MB**, enforced by the
  admin-auth-protected `/admin/media/upload` route.

## 7. Admin changes

- `components/entity-image-field.tsx` — made reusable via `label`, `description`,
  `previewAlt` props (defaults unchanged for existing callers).
- `components/staff-form.tsx`, `components/partner-form.tsx` — embed `EntityImageField`,
  track `imageFile` / `removeImage`, pass them through on submit.
- `app/staff/add`, `app/partners/add` — create record, then upload image if provided.
- `app/staff/update/[id]`, `app/partners/update/[id]` — update record, then replace image
  (or remove if flagged), else preserve existing image. **(imports fixed here.)**
- `app/staff/page.tsx`, `app/partners/page.tsx` — list thumbnails with initials fallback
  via `resolveAdminMediaUrl`.
- `lib/admin-api.ts` — image/logo fields on `StaffItem`/`PartnerItem`, optional
  `imageFile`/`removeImage` on inputs, extended entity unions.

## 8. Public frontend changes

- `lib/public-api.ts` — `StaffMember` gains `image_url` / `image_alt_text` /
  `image_caption` (`Partner` logo fields already present).
- `components/public-components.tsx` — `StaffCard` renders the profile image through
  `MediaImage` (which resolves the public URL) with the existing `UsersRound` icon
  fallback. `PartnerCard` logo rendering pre-existed. Existing design/typography/spacing
  untouched.

## 9. Backward compatibility

Staff/Partners without media render existing fallbacks (icon / initials / avatar
placeholder). All image fields are nullable and null-guarded in admin and public UIs, so
existing records and missing/unavailable media never break a page.

## 10. Testing performed

- ✅ `tsc --noEmit` — `apps/api`, `apps/admin-site`, `apps/public-site` all pass.
- ✅ Full data-flow trace by inspection (form → media API → R2 → DB association → API
  response → public render).
- ✅ Verified no subquery-in-RETURNING; media columns resolve in normal SELECTs.

**Not yet run (requires a live stack — `wrangler dev` with D1 + R2, admin, public):**
the manual click-through (create/edit staff & partner with and without images, confirm
upload, association, public render, image replacement). Code paths are verified statically;
runtime smoke test remains as a manual step.

## 11. D1 migration required?

**No.** The existing schema already supports staff/partner media associations.

## 12. Deployment / remaining steps

- No migration to apply.
- Deploy the three apps as usual (`api`, `admin-site`, `public-site`).
- Recommended manual smoke test after deploy: the create/edit/replace/remove flow for a
  Staff member and a Partner, then confirm the public Staff photo and Partner logo.

## Notes / out of scope

- Changes were intentionally limited to Staff/Partner image management. No unrelated
  files, features, or designs were modified.
- Repeatedly replacing an image accumulates soft-hidden `media_files` rows (by design of
  the existing soft-lifecycle) — harmless, but a future cleanup job could prune
  long-hidden orphans if desired. **Not addressed here** (out of scope).
