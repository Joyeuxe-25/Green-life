# Phase 15D: Public Content, Images, Logos, Cards, And Visual Completion Fix Report

## Summary

Phase 15D completed the public website content/media visibility pass using D1/API/R2-backed data. Public content remains dynamic and is not hardcoded into React pages.

Enhanced photos, the Green for Life Rwanda logo, and real partner logos are registered through local R2 and D1 `media_files`. The public API now returns image/logo URLs for homepage content, projects, partners, site logo, favicon, and footer content. The public site mapping and card styles were updated to render those dynamic URLs cleanly.

Browser visual QA could not be completed by Codex because the in-app browser webview failed to attach. Human manual visual QA is still required.

## Root Causes Found

- Public cards looked empty because media existed separately from the content/cards and the public API did not return first attached media for partners.
- Partner logos existed in `00_INPUTS` but were not registered in `media_files` or returned by `/public/partners`.
- The footer looked thin because the public footer read `footer_text`, while the seeded setting key was `footer.summary`.
- Header/footer had no dynamic GLR logo mapping.
- Project/news/event cards needed frontend support for API-provided image fields.
- The About `who-we-are` block was correctly set to `draft` in Phase 15C and remains unpublished.

## Content Checked And Fixed

Local D1 currently contains:

- `12` content blocks
- `4` impact stats
- `4` programs
- `3` projects
- `0` news records
- `0` events records
- `7` partners
- `site_settings` including `footer.summary`, `site.logo_url`, and `site.favicon_url`

Confirmed impact numbers remain:

- `350` smallholder farmers trained
- `329,425` trees planted
- `365` hectares restored
- Permanent tree nurseries established

Approved projects remain:

- Mushonyi Community-Led Restoration in Rutsiro District
- Environmental Clubs in Sustainable Agroforestry in Gisagara District
- School Greening and Environmental Education in Gisagara District

No fake staff, news, or events were added.

## Images Fixed

Enhanced AVIF image pack:

- Zip exists at `00_INPUTS/05_enhanced_avif_media/Green_Life_Rwanda_Enhanced_AVIF_Media.zip`
- `30` AVIF images are available
- No banned AVIF file was found
- `about-team-meeting` and `8Z6A5893` are not used

Enhanced images are registered in local R2/D1:

- `30` active enhanced image records
- `30` usable public media URLs
- Public media serving route: `GET /public/media/file/:id`

Content block image URLs are populated for:

- `home/hero`
- `home/mission-preview`
- `home/support-cta`
- `programs/intro`
- `impact/intro`
- `contact/intro`
- `donate/intro`
- `get-involved/intro`
- `about/mission`
- `about/history`

Projects use `media_files.entity_type = 'project'` and `entity_id = project id`.

News/events image mapping is supported by API/frontend code, but there are no local published news or public event records to attach images to.

## Partner Logos Fixed

Real partner logos were found and imported from:

```powershell
00_INPUTS/04_partner_logos/originals/
```

Imported partner logos:

- World Connect
- Biocoor
- Segal Family Foundation
- RGB
- Bridge of Hope
- FMI Ubumuntu

Restore Local remains text-only because no logo is expected/provided.

Partner logos are attached through:

```text
media_files.entity_type = 'partner'
media_files.entity_id = partners.id
```

The public API now returns:

- `logo_url`
- `logo_alt_text`
- `logo_caption`

for partners.

## GLR Logo And Favicon

The real Green for Life Rwanda logo was provided by the user and placed under ignored inputs:

```powershell
00_INPUTS/06_green_life_logo/green-life-rwanda-logo.jpeg
```

It was imported through local R2/D1 as:

```text
brand-green-life-rwanda-logo
```

Site settings now include:

- `site.logo_url`
- `site.favicon_url`

Both point to the local public media route for the real GLR logo.

No logo or favicon file was copied into `apps/public-site`.

## Public API Smoke Check

Command used a temporary local API dev server and checked:

- `/public/home`
- `/public/projects`
- `/public/partners`
- `/public/site-settings`
- `/public/about`

Result:

- Homepage blocks: `3`
- Homepage blocks with image URLs: `3`
- Projects: `3`
- Projects with image URLs: `3`
- Partners: `7`
- Partners with logo URLs: `6`
- GLR logo URL: `http://localhost:8787/public/media/file/brand-green-life-rwanda-logo`
- Footer content returned: `Green Life Rwanda works with communities to protect the environment, promote sustainable agroforestry, and improve resilient livelihoods.`
- About `who-we-are` blocks returned by public API: `0`

## Public-Site Fixes

Frontend mapping updates:

- Partner cards now render API-provided partner logos.
- Header/footer now read GLR logo URL from `site_settings`.
- Footer now reads `footer.summary`.
- Root layout adds dynamic favicon link from `site.favicon_url`.
- Project/news/event cards and detail heroes render API-provided image URLs.

Layout/card polish:

- More consistent card grid sizing and spacing.
- Fixed photo aspect ratios with `object-cover`.
- Partner logos use `object-contain`.
- Header/footer logo sizing is controlled.
- Hero height reduced and controlled.
- Empty states styled more intentionally.

## Staff And Events Status

Staff:

- Still dynamic only.
- No staff members were hardcoded.
- Empty state remains the public-site fallback when no staff records exist.

Events:

- Still dynamic only.
- No fake events were added.
- Empty state remains the public-site fallback when no event records exist.

## Files Changed

API:

- `apps/api/src/db/public.ts`
- `apps/api/src/routes/public.ts`
- `apps/api/scripts/import-enhanced-media-local.mjs`
- `apps/api/scripts/import-brand-partner-logos-local.mjs`

Public site:

- `apps/public-site/lib/public-api.ts`
- `apps/public-site/components/public-components.tsx`
- `apps/public-site/components/site-header.tsx`
- `apps/public-site/components/site-footer.tsx`
- `apps/public-site/app/layout.tsx`
- `apps/public-site/app/globals.css`
- `apps/public-site/app/projects/[slug]/page.tsx`
- `apps/public-site/app/news/[slug]/page.tsx`
- `apps/public-site/app/events/[slug]/page.tsx`

Docs:

- `docs/PHASE_15D_PUBLIC_CONTENT_IMAGES_LOGOS_AND_CARDS_FIX_REPORT.md`

Ignored input placement:

- `00_INPUTS/06_green_life_logo/green-life-rwanda-logo.jpeg`

## Typecheck

Command:

```powershell
pnpm --recursive typecheck
```

Result:

- Passed for `apps/admin-site`
- Passed for `apps/api`
- Passed for `apps/public-site`
- Passed for `packages/shared`

## Source Safety Checks

Confirmed:

- No real content was hardcoded into React pages.
- No selected image/logo files were copied into `apps/public-site`.
- No `00_INPUTS` source references were found in public/API runtime source.
- No selected enhanced image filenames were hardcoded into public-site React pages.
- No banned image references were found in public/API runtime source.
- `00_INPUTS/` remains ignored by Git.

## Browser Visual QA

Codex attempted to use the in-app browser, but the browser webview failed to attach. Browser visual QA could not be completed by Codex.

Human manual visual QA is required:

1. Start API and public site.
2. Open `/`.
3. Confirm hero, cards, images, partner logos, header logo, and footer render cleanly.
4. Open `/projects`.
5. Confirm all project cards show images.
6. Open `/partners`.
7. Confirm six partner logos render and Restore Local is text-only.
8. Open `/about`.
9. Confirm the old Who We Are section is not visible.
10. Check mobile, tablet, and desktop widths.

## Commands To Run Next

```powershell
pnpm --filter api dev
pnpm --filter public-site dev
pnpm --recursive typecheck
```

Optional local import reruns:

```powershell
cd apps/api
pnpm exec node scripts/import-enhanced-media-local.mjs
pnpm exec node scripts/import-brand-partner-logos-local.mjs
```
