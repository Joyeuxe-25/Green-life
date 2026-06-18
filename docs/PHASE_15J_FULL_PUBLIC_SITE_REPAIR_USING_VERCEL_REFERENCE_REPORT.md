# Phase 15J Full Public Site Repair Using Vercel Reference Report

## Scope

Phase 15J repaired the public Green Life Rwanda Next.js website using the Vercel reference site as the primary visual/content guide while keeping the website dynamic through the public API and D1/R2-backed media flow.

No admin authentication, admin CRUD logic, old static HTML, or database schema changes were made.

## Reference Used

- Primary reference: `https://green-for-life-rwanda-one.vercel.app`
- Secondary reference: `legacy-static-site/`
- Existing D1/API content mapping and prior Phase 15 reports

## Files Changed

- `apps/api/seeds/0001_initial_public_content.sql`
- `apps/api/scripts/import-brand-partner-logos-local.mjs`
- `apps/api/scripts/import-enhanced-media-local.mjs`
- `apps/public-site/app/globals.css`
- `apps/public-site/app/layout.tsx`
- `apps/public-site/app/page.tsx`
- `apps/public-site/app/impact/page.tsx`
- `apps/public-site/app/partners/page.tsx`
- `apps/public-site/app/staff/page.tsx`
- `apps/public-site/components/public-components.tsx`
- `apps/public-site/components/site-footer.tsx`
- `apps/public-site/components/site-header.tsx`
- `apps/public-site/lib/public-api.ts`
- `docs/PHASE_15J_FULL_PUBLIC_SITE_REPAIR_USING_VERCEL_REFERENCE_REPORT.md`

## Root Causes Found

- The public site still felt too plain because the page background and sections were close to white everywhere.
- Header navigation could wrap awkwardly on desktop because too many full navigation links were competing with CTA buttons.
- API-relative image and logo paths were not consistently resolved by the public frontend.
- Footer content existed in the system but needed to be narrowed to the Vercel-style footer content and links.
- Homepage latest updates could create empty-feeling space when news/events had no published records.
- Program cards used confusing generated initial badges.
- Restore Local publicly displayed internal “text-only until a logo is provided” wording.
- The homepage hero media mapping used a weaker image and needed to point to a better enhanced image.

## Header Fixes

- Rebuilt the public header as a compact light header.
- Reduced primary navigation to avoid awkward desktop wrapping.
- Kept Donate and Get Involved as clean CTA buttons.
- Confirmed no Reports link is present.
- Resolved logo URLs from API/site settings instead of using local hardcoded image files.
- Kept logo sizing controlled with `object-contain` and a small max height.

## Favicon Fixes

The processed favicon assets are referenced through D1/site settings and media routes:

- `/public/media/file/media-green-life-favicon-ico`
- `/public/media/file/media-green-life-favicon-32-png`
- `/public/media/file/media-green-life-favicon-48-png`
- `/public/media/file/media-green-life-apple-touch-icon-png`
- `/public/media/file/media-green-life-favicon-192-png`
- `/public/media/file/media-green-life-favicon-512-png`

The raw JPEG logo was not used, and the ISOKO logo was not used.

## Homepage Repairs

Homepage flow now follows the requested Vercel-reference structure:

1. Hero
2. Short intro/about preview
3. What We Do / Areas of Work
4. Impact stats
5. Community story blocks when present
6. Featured activities/projects
7. Partners preview
8. Latest updates only when real news/events data exists
9. CTA
10. Footer

The home hero image mapping was changed to the enhanced media item:

- `home/hero` -> `/public/media/file/enhanced-community-seedling-training`

The hero styling was tightened in source CSS with reduced title sizing, better line height, controlled height, object-cover image behavior, and a soft light overlay instead of a dark overlay.

## Light Green Design System

The public site now uses a more consistent soft green design direction:

- Main page background: `#F3FAEF` / `#EEF7E8`
- Card background: `#FFFDF7`
- Section background: `#F8F4E8` / `#EEF7E8`
- Primary green: `#2E7D4F`
- Accent green: `#63A84F`
- Fresh highlight: `#A7D46F`
- Text: `#1D2A22`
- Muted text: `#667265`

The footer remains light, not dark green.

## Card Modernization

Updated the public card system to be more compact and consistent:

- Smaller card spacing and headings
- 16:9 media frames for photo cards
- `object-cover` for photos
- `object-contain` for partner logos
- Soft borders and shadows
- Responsive grids
- Cleaner action links
- Removed confusing generated initial badges from program cards

## Partner Fixes

- Partner cards are smaller and cleaner.
- Partner logos render through API/media URLs.
- Logos use contained image behavior instead of stretching.
- Restore Local remains text-only without exposing internal placeholder wording.
- No fake logos were added.

## Footer Fixes

Footer content was updated through seed/site settings, not hardcoded into React:

- Summary: `Empowering communities to conserve the environment and improve livelihoods across Rwanda.`
- Email: `greenforliferwanda@gmail.com`
- Phone: `+250-788-487-932`
- Location: `Huye, South Province, Rwanda`
- Copyright: `© 2026 Green Life Rwanda. All rights reserved.`

Footer links are intentionally limited to:

- Contact Us
- Donate

No Programs, Projects, Get Involved, Partners, News, Reports, or large quick-link groups are shown in the footer.

## API and Data Changes

The API schema was not changed.

Seed/import updates were made so dynamic data supports the repaired public site:

- Footer settings updated.
- Contact settings updated.
- Processed logo/favicon site settings added.
- Home hero image mapping updated.
- `about/who-we-are` remains unpublished/draft.
- Restore Local partner description cleaned.
- Processed GLR logo/favicon import script updated to use the processed pack only.
- Enhanced image import script updated to map a better home hero image.

Local imports completed:

- 30 enhanced AVIF media records imported locally.
- 14 processed logo/favicon/partner logo assets imported locally.

## API Smoke Check

Public API smoke checks confirmed:

- `/public/home` returns homepage content blocks with image URLs.
- `/public/home` returns project image URLs.
- `/public/home` returns partner logo URLs.
- `/public/site-settings` returns GLR logo and favicon URLs.
- `/public/site-settings` returns footer summary/contact/copyright values.
- News and events currently return empty arrays locally, so homepage latest updates are hidden unless real data exists.

## Empty State Behavior

- News page: polished empty state when no news exists.
- Events page: polished empty state when no events exist.
- Staff page: dynamic only, with `Staff profiles will be updated soon.` when no staff exists.
- Homepage does not show a large empty latest-updates section when both news and events are empty.

## Visual QA

Browser visual QA was performed on:

- `/`
- `/about`
- `/programs`
- `/projects`
- `/impact`
- `/partners`
- `/news`
- `/events`
- `/staff`
- `/donate`
- `/contact`
- `/get-involved`

Confirmed during browser checks:

- Header navigation no longer wraps awkwardly in the checked desktop viewport.
- No Reports link was found.
- Footer links are only Contact Us and Donate.
- Partner cards render as compact logo/text cards.
- Staff, news, and events use polished empty states when data is missing.
- API-backed images/logos are used instead of files copied into `apps/public-site`.

Remaining visual QA caveat:

- The browser dev server appeared to keep serving a stale CSS chunk for some hero sizing checks even after source CSS was tightened. The source CSS has been updated, but a fresh dev server or hard refresh should be used for final human visual QA before deployment.

## Typecheck

Command run:

```powershell
pnpm --recursive typecheck
```

Result:

- Passed after rerunning outside the sandbox because the sandboxed command failed with a package-manager fetch error.

## Confirmations

- No real organization content was hardcoded into React pages.
- Real footer/contact content was added through seed/site settings.
- No raw JPEG logo was used.
- No ISOKO logo was used.
- No images or logos were copied into `apps/public-site`.
- No old HTML was restored as the live website.
- No Reports link was added.
- No admin-site changes were made.
- No auth changes were made.
- No commit was made.

## Remaining Issues

- Human browser QA should be completed from a freshly restarted public dev server to confirm the latest CSS chunk is loaded.
- If production D1/R2 does not yet contain the seeded settings/media records, the seed/import scripts must be run for the target environment.
- News and events remain empty locally unless real records are added through admin or seed/import scripts.

## Recommended Next Step

Run a fresh local preview and complete human visual QA:

```powershell
pnpm --filter api dev
pnpm --filter public-site dev
```

Then review:

- `http://localhost:3000/`
- `http://localhost:3000/about`
- `http://localhost:3000/programs`
- `http://localhost:3000/projects`
- `http://localhost:3000/impact`
- `http://localhost:3000/partners`
- `http://localhost:3000/news`
- `http://localhost:3000/events`
- `http://localhost:3000/staff`
- `http://localhost:3000/donate`
- `http://localhost:3000/contact`
- `http://localhost:3000/get-involved`
