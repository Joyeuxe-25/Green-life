# Phase 15I: Public Next.js Rebuild From Legacy Reference Report

## Summary

The public Next.js website was rebuilt visually using `legacy-static-site/` as a layout reference while keeping the live site fully dynamic through the Phase 12 public API. The old HTML was not restored as the live website, and no real organization content or image paths were hardcoded into React pages.

## Reference Used

- `legacy-static-site/`
- `docs/PHASE_15G_LEGACY_CONTENT_AUDIT_AND_D1_MAPPING_REPORT.md`
- `docs/PHASE_15H_PROCESSED_LOGO_AND_FAVICON_PACK_REPORT.md`
- Existing `apps/public-site` dynamic API structure

Legacy ideas reused:

- Homepage flow: hero, impact, content sections, programs, projects, news/events preview, partners, CTA.
- Light grouped footer concept with brand, links, support actions, and contact values.
- Card-based layout for programs, projects, news, events, partners, staff, and impact stats.

Legacy elements intentionally not reused:

- Reports navigation/page.
- Old static HTML/CSS/JS as live code.
- Static image paths.
- Dark-heavy hero/footer treatment.
- Oversized card imagery.

## Files Changed

- `apps/public-site/app/globals.css`
- `apps/public-site/app/page.tsx`
- `apps/public-site/app/impact/page.tsx`
- `apps/public-site/app/partners/page.tsx`
- `apps/public-site/app/staff/page.tsx`
- `apps/public-site/components/public-components.tsx`
- `apps/public-site/components/site-footer.tsx`
- `apps/public-site/components/site-header.tsx`
- `docs/PHASE_15I_PUBLIC_NEXTJS_REBUILD_FROM_LEGACY_REFERENCE_REPORT.md`

Note: The working tree already contained other public-site changes from previous phases. This phase only intentionally changed the files listed above.

## Pages Rebuilt

Existing dynamic pages were kept and restyled through the shared layout/components:

- `/`
- `/about`
- `/programs`
- `/projects`
- `/projects/[slug]`
- `/impact`
- `/news`
- `/news/[slug]`
- `/events`
- `/events/[slug]`
- `/staff`
- `/partners`
- `/donate`
- `/contact`
- `/get-involved`

## Header Changes

- Light sticky header background.
- Logo loads from public API site settings when available.
- Text fallback remains clean when the logo URL is missing.
- Logo is constrained with `object-contain` and a 48px to 56px visual range.
- Navigation is simplified and responsive.
- Donate and Get Involved are styled as clear actions.
- No Reports link was added.

## Footer Changes

- Footer is now light cream instead of dark green.
- Footer uses API site settings for logo/name/summary/contact values when available.
- Footer includes grouped UI links for Explore and Support.
- Footer avoids hardcoded real footer organization text.
- Footer logo uses `object-contain`.

## Card System Changes

- Compact modern card system with smaller spacing.
- 16:9 image containers for photos.
- `object-cover` for photos.
- `object-contain` for partner logos.
- Smaller partner logo boxes.
- Soft border and shadow.
- Responsive grid behavior:
  - 3 cards per row on desktop where suitable.
  - 2 cards per row on tablet.
  - 1 card per row on mobile.
- Staff and events remain dynamic only.

## Color And Light Design Changes

Applied the Phase 15H light direction:

- Main background: `#FFFDF7`
- Section background: `#F8F4E8`
- Soft green backgrounds: `#EEF7E8` and `#F3FAEF`
- Primary green: `#2E7D4F`
- Accent green: `#63A84F`
- Fresh highlight: `#A7D46F`
- Text: `#1D2A22`
- Muted text: `#667265`

Avoided:

- Dark green large backgrounds.
- Dark green full footer.
- Black hero overlays.
- Heavy dark sections.

## Homepage Hero Handling

The homepage hero still reads from the public API content block selected by `pickHero`. If a hero `image_url` is available, the hero uses it with a light overlay and controlled height. This keeps Phase 15J free to change the hero image through D1/media mapping without changing React page code.

## Staff And Events Handling

- Staff remains dynamic from `/public/staff`.
- Staff empty state now uses: `Staff profiles will be updated soon.`
- Events remains dynamic from `/public/events`.
- Events shows a polished empty state when no published events are available.
- No fake staff or fake events were added in React.

## API And Media Mapping Notes For Phase 15J

The frontend now expects the existing public API/media fields:

- Content block images: `content_blocks.image_url`
- Project/news/event card images: API `image_url`
- Partner logos: API `logo_url`
- Site logo/favicon: `site_settings` values such as `site.logo_url`, `site.footer_logo_url`, and `site.favicon_url`
- Footer summary/contact: `site_settings`

Known Phase 15J follow-up:

- Verify local/prod D1 records have complete image URLs and logo URLs populated.
- Verify hero image mapping for `home/hero`.
- Verify footer logo setting exists if a separate footer logo should be used.
- Verify partner logo URLs are present for all partners except text-only Restore Local.

No API changes were made in this phase.

## Safety Checks

Completed searches in `apps/public-site`:

- No `Reports` or `reports.html` references found.
- No `legacy-static-site` references found.
- No old `assets/images` references found.
- No `00_INPUTS` references found.
- No processed logo/favicon filenames were hardcoded.
- No `about-team-meeting` references found.
- No `8Z6A5893` references found.

## Testing

Command run:

```powershell
pnpm --recursive typecheck
```

Result:

- Passed after rerunning outside the sandbox because the first sandboxed run failed with `fetch failed`.
- `apps/admin-site`, `apps/api`, `apps/public-site`, and `packages/shared` all completed typecheck successfully.

## Confirmations

- No real organization content was hardcoded into React pages.
- No old HTML was restored as the live website.
- No images or logos were copied into `apps/public-site`.
- No Reports link was added.
- No admin-site changes were made.
- No auth changes were made.
- No commit was made.

## Recommended Next Phase

Phase 15J: API/media mapping verification and final public visual QA.
