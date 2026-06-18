# Phase 15I Replacement: Public Next.js Rebuild Using Vercel Reference Report

## Summary

The public Next.js site was rebuilt using the Vercel reference site as the primary visual/content guide while keeping the implementation dynamic through the public API and D1-backed content. The old static HTML was not restored as the live website, and no real organization content or image/logo files were hardcoded into React pages.

Primary reference:

- `https://green-for-life-rwanda-one.vercel.app`

Secondary references:

- `legacy-static-site/`
- `docs/PHASE_15G_LEGACY_CONTENT_AUDIT_AND_D1_MAPPING_REPORT.md`
- `docs/PHASE_15H_PROCESSED_LOGO_AND_FAVICON_PACK_REPORT.md`

## Reference Structure Observed

The Vercel reference homepage uses this flow:

- Light header with logo and navigation.
- Hero with title, subtitle, image, and two buttons.
- Short organization intro/about preview.
- What We Do cards.
- Impact stats.
- Community voices/testimonials.
- Featured activities.
- Get involved CTA.
- Latest updates.
- Footer with summary, quick links, contact, follow area, and copyright.

The rebuilt Next.js homepage follows the same broad structure but keeps real copy, stats, images, projects, partners, footer text, and contact details dynamic.

## Files Changed

- `apps/public-site/app/globals.css`
- `apps/public-site/app/page.tsx`
- `apps/public-site/app/impact/page.tsx`
- `apps/public-site/app/partners/page.tsx`
- `apps/public-site/app/staff/page.tsx`
- `apps/public-site/components/public-components.tsx`
- `apps/public-site/components/site-footer.tsx`
- `apps/public-site/components/site-header.tsx`
- `docs/PHASE_15I_REBUILD_USING_VERCEL_REFERENCE_REPORT.md`

## Homepage Rebuild

The homepage was restructured to match the Vercel reference flow:

- Hero stays API-driven through the selected `home` hero content block.
- Intro/about preview is rendered from matching D1 content blocks when available.
- What We Do uses `programs` from the public API.
- Impact uses `impact_stats` from the public API.
- Community voices/stories render only when matching D1 content blocks exist.
- Featured activities use public `projects`.
- Get involved CTA uses a `content_blocks` CTA block.
- Latest updates use public `news` and `events`.
- Partners use public `partners`.

No Vercel reference text was copied into React as permanent content.

## Header Fixes

- Light sticky header.
- Logo loads from API/site settings when available.
- Clean text fallback if logo is missing.
- Logo height is constrained to roughly 48px to 56px.
- Navigation is compact and responsive.
- Donate and Get Involved are styled as clear actions without heavy dark treatment.
- No Reports link.

## Footer Fixes

- Footer is light cream, not dark green.
- Footer uses API/site settings for:
  - site name
  - logo URL
  - footer summary
  - contact email/phone/address
  - social links when available
- Footer includes safe UI labels for Explore, Support, Contact, and social link names.
- No real footer organization text was hardcoded in React.

## Cards Modernized

- Compact card spacing.
- 16:9 image ratio for photo cards.
- `object-cover` for photos.
- `object-contain` for logos.
- Small partner logo boxes.
- Soft borders and shadows.
- Responsive grids:
  - 3 columns on desktop where suitable.
  - 2 columns on tablet.
  - 1 column on mobile.

## Pages Updated

The shared layout/card/header/footer changes update the public pages:

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

## Hero Image Handling

The hero image remains controlled by API content block `image_url`. The React structure is prepared so Phase 15J can replace the current weak homepage hero image by updating media/D1 mapping, not React code.

## About "Who We Are" Rule

The Vercel reference has a "Who We Are" section. This phase did not hardcode or recreate the removed About page "Who We Are" section in React. Homepage intro content is allowed only when it comes from approved D1 content blocks.

## Content And API Gaps For Phase 15J

Follow-up items:

- Confirm the `home/hero` content block uses a stronger enhanced media URL.
- Confirm intro/about preview blocks are approved and do not reintroduce the removed About page section.
- Confirm community voices/testimonials are approved before publishing them as D1 content.
- Confirm all partner logo URLs are populated except text-only Restore Local.
- Confirm `site.logo_url`, `site.footer_logo_url`, `site.favicon_url`, footer summary, contact details, and social links are populated through `site_settings`.
- Confirm news/events/projects images are attached through media/API URLs.

## Safety Checks

Searches completed in `apps/public-site`:

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

- Passed after rerunning outside the sandbox because the sandboxed run failed with a bare `fetch failed`.
- `apps/admin-site`, `apps/api`, `apps/public-site`, and `packages/shared` all completed typecheck successfully.

## Confirmations

- Vercel reference site was used as the primary guide.
- Legacy static site was used only as secondary reference.
- No old HTML was restored as the live website.
- No real organization content was hardcoded into React pages.
- No images or logos were copied into `apps/public-site`.
- No raw JPEG logo was used.
- No Reports link was added.
- No admin-site changes were made.
- No auth changes were made.
- No commit was made.

## Recommended Next Phase

Phase 15J: Final API/media mapping, stronger homepage hero image assignment, and browser visual QA.
