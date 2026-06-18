# Phase 15L Color Balance and Projects Hero Report

## Scope

Phase 15L reduced the heavy dark green feeling on the public website and added a D1/API-backed Projects page hero image.

No admin-site, auth, old static HTML, or commit work was performed.

## Files Changed

- `apps/api/src/db/public.ts`
- `apps/api/src/routes/public.ts`
- `apps/api/seeds/0001_initial_public_content.sql`
- `apps/public-site/app/projects/page.tsx`
- `apps/public-site/app/globals.css`
- `apps/public-site/lib/public-api.ts`
- `docs/PHASE_15L_COLOR_BALANCE_AND_PROJECTS_HERO_REPORT.md`

## Dark Green Usage Reduced

Dark green remains in the header, buttons, headings, and accents.

Large dark green surfaces were reduced:

- CTA section changed from a dark green full-width block to a soft green/cream section.
- CTA now uses a green accent border, dark green heading, muted body text, and standard dark green buttons.
- Footer changed from a massive dark green block to a light cream/soft green footer.
- Footer keeps only a thin dark green bottom strip for copyright.

## Footer Visual Balance

Footer still includes:

- Green Life Rwanda logo/name
- Summary
- Email
- Phone
- Location
- Contact Us link
- Donate link
- Copyright

Footer links remain limited to:

- Contact Us
- Donate

Source CSS now uses:

- Light footer background: cream/soft green gradient
- Dark green footer headings/links
- Small dark green copyright strip

## Projects Hero Image

Projects page now uses the same D1/public API content-block pattern as the other public pages.

API changes:

- Added `projects` to the public content page key type.
- `GET /public/projects` now returns:
  - `page`
  - `blocks`
  - `projects`

Frontend changes:

- `/projects` now calls `pickHero(blocks, "Projects")`.
- Hero content and image come from the public API.

Seeded Projects hero:

- Content block ID: `cb-projects-intro`
- Page key: `projects`
- Block type: `hero`
- Image URL: `/public/media/file/enhanced-tree-planting-demonstration`

API smoke check confirmed:

- `/public/projects` returns the Projects hero block.
- `/public/projects` returns the Projects hero image URL.

Browser check confirmed:

- `/projects` rendered hero image `http://localhost:8787/public/media/file/enhanced-tree-planting-demonstration`.
- Hero image opacity was `1`.
- Hero overlay used the dark green text-side gradient.

## Page Hero Overlay Status

Hero styling remains consistent with Phase 15K:

- No full white fog overlay.
- No full-image opacity fade.
- `object-cover` image behavior.
- Dark green gradient only on the text side.
- Text remains readable.

## Animations and Icons Preserved

No animation/icon system was removed.

Preserved:

- Impact number count-up component.
- Card reveal animation.
- Hero text entrance.
- CTA and button hover transitions.
- Program/contact/donate/footer icons.
- Reduced-motion support.

## Typecheck

Command:

```powershell
pnpm --recursive typecheck
```

Result:

- Passed.

## Visual QA

Checked in browser:

- `/projects`
- `/`

Confirmed:

- Projects page has an API/media hero image.
- Projects hero image is clear and not faded by opacity.
- No Reports link was found.
- Staff is not in top navigation.
- Footer links are only Contact Us and Donate.

Visual QA limitation:

- The existing `localhost:3000` dev server continued serving stale CTA/footer CSS during the browser check, even after source CSS was updated.
- A fresh alternate dev server on port `3002` did not start successfully inside Codex.
- Source CSS was verified, typecheck passed, and API/browser checks confirmed the Projects hero. Human visual QA should restart the public dev server and verify the softened CTA/footer visually.

## Confirmations

- No real organization content was hardcoded into React pages.
- Projects hero content/image mapping was added through D1 seed/API.
- No images were copied into `apps/public-site`.
- No Reports link was added.
- Staff is not in the top navigation.
- No old static HTML was restored as the live site.
- No admin-site changes were made.
- No auth changes were made.
- No commit was made.

## Recommended Manual QA

Restart both local servers:

```powershell
pnpm --filter api dev
pnpm --filter public-site dev
```

Then hard-refresh and check:

- `http://localhost:3000/`
- `http://localhost:3000/projects`
- Footer
- CTA section
- Mobile viewport
