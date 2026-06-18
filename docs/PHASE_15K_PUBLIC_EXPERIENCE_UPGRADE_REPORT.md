# Phase 15K Public Experience Upgrade Report

## Scope

Phase 15K upgraded the public Green Life Rwanda website experience across the public Next.js app, with small API additions for public contact and donation form submission.

No admin authentication, admin CRUD logic, old static HTML restoration, or commit was performed.

## Files Changed

- `apps/api/src/db/public.ts`
- `apps/api/src/routes/public.ts`
- `apps/api/seeds/0001_initial_public_content.sql`
- `apps/public-site/app/about/page.tsx`
- `apps/public-site/app/contact/page.tsx`
- `apps/public-site/app/donate/page.tsx`
- `apps/public-site/app/globals.css`
- `apps/public-site/app/partners/page.tsx`
- `apps/public-site/components/animated-impact-stat-card.tsx`
- `apps/public-site/components/contact-form.tsx`
- `apps/public-site/components/donation-form.tsx`
- `apps/public-site/components/public-components.tsx`
- `apps/public-site/components/site-footer.tsx`
- `apps/public-site/lib/public-api.ts`
- `docs/PHASE_15K_PUBLIC_EXPERIENCE_UPGRADE_REPORT.md`

Note: the worktree already contained additional modified/untracked files from earlier phases. They were not reverted.

## Hero Fog Fix

- Removed the heavy white/fog hero overlay.
- Kept hero image opacity at `1`.
- Added a left-side dark green gradient overlay for text readability.
- Kept the right side of hero photos clearer.
- Added subtle saturation/contrast treatment instead of fading the full image.
- Kept hero images using `object-cover`.

Verified on homepage:

- Hero image: `http://localhost:8787/public/media/file/enhanced-community-seedling-training`
- Hero image opacity: `1`
- Overlay: dark green left-to-right gradient

## Dark Green Header and Footer

Header:

- Changed to a strong dark green branded header.
- Kept logo sizing controlled.
- Kept Donate and Get Involved as professional action buttons.
- Confirmed Staff is not in top navigation.
- Confirmed Reports is not in top navigation.

Footer:

- Changed to dark green with cream/light text.
- Added footer contact icons.
- Kept footer links limited to:
  - Contact Us
  - Donate
- Footer logo still comes from API/site settings/media URL.

## Staff Moved Into About

- About page now fetches staff dynamically from `/public/staff`.
- Added an About page Staff section.
- If no staff records exist, it shows: `Staff profiles will be updated soon.`
- `/staff` route remains available with the same dynamic/empty-state behavior.
- Staff is not shown in the top navigation.
- No fake staff members were added.

## Partners Page Hero

- `/public/partners` now returns partner page content blocks plus partner records.
- Added a D1 seed content block for the Partners hero.
- Partners hero image uses:
  - `/public/media/file/enhanced-community-seedling-training`
- Browser QA confirmed Partners hero image renders with opacity `1`.

## Impact Count Animation

- Added `AnimatedImpactStatCard`.
- Uses `IntersectionObserver`.
- Includes an immediate-in-view fallback.
- Respects `prefers-reduced-motion`.
- Does not animate endlessly.
- Formats numeric values using `Intl.NumberFormat`.

Browser note:

- Initial browser automation showed stats at `0` before the fallback update.
- The component was hardened after that finding.
- Final recursive typecheck passed after the change.
- Browser automation became unstable during the final animation recheck, so human visual confirmation of count-up is still recommended.

## Additional Animations

Added subtle, reduced-motion-aware animations for:

- Hero text entrance
- Card reveal treatment
- CTA treatment
- Partner/card hover states
- Button hover/focus feel

No heavy animation package was added.

## Icons Added

Used existing `lucide-react` dependency.

Icons were added for:

- Program cards
- Project/news/event fallback cards
- Staff cards
- Impact stats
- Contact details
- Donation support info
- Footer contact details

Confusing generated initials were not reintroduced.

## Donate Page Form

Donate page now includes a donation inquiry form with:

- Name
- Email
- Phone
- Donation interest
- Message

Submission target:

- `POST /public/donation-messages`

Smoke test result:

- Public donation form endpoint returned `ok: true` and a message ID.

No payment numbers, bank details, or invented payment instructions were added. Real payment details remain missing and should be provided before production donation instructions are published.

## Contact Page Form

Contact page now includes:

- Dynamic contact information from site settings
- Contact form with name, email, phone, subject, and message
- Loading, success, and error states
- Email, phone, and location icons

Submission target:

- `POST /public/contact-messages`

Smoke test result:

- Public contact form endpoint returned `ok: true` and a message ID.

## API Changes

Added public insert helpers:

- `createPublicContactMessage`
- `createPublicDonationMessage`

Added public POST routes:

- `POST /public/contact-messages`
- `POST /public/donation-messages`

Updated public partners response:

- `GET /public/partners` now returns:
  - `page`
  - `blocks`
  - `partners`

Validation:

- Contact messages require name, valid email, and message.
- Donation messages require name, valid email, and message.
- SQL writes are parameterized.
- Existing D1 tables are used.

No schema migration was created.

## Typecheck

Command:

```powershell
pnpm --recursive typecheck
```

Result:

- Passed.

## Smoke Tests

API smoke tests:

- `GET /public/partners` returned the Partners hero block, hero image URL, and partner logo URLs.
- `POST /public/contact-messages` returned `ok: true`.
- `POST /public/donation-messages` returned `ok: true`.

Browser smoke checks completed:

- Homepage header/footer/hero checked.
- About page staff section checked.
- Partners page hero checked.
- Contact form presence checked.
- Donate form presence checked.
- Staff page empty state checked.
- Events and News pages checked for footer/nav consistency.

Confirmed in browser checks:

- Header background is dark green.
- Footer background is dark green.
- Footer links are only Contact Us and Donate.
- No Reports link.
- No Staff link in top navigation.
- Homepage hero image is not faded by opacity.
- Contact and Donate forms are present.
- Partners hero uses an API/media image.

Browser limitation:

- Browser automation became unstable during the final impact count-up recheck, so human visual confirmation of the count animation is still required.

## Confirmations

- No real organization content was hardcoded directly into React pages.
- Real content and media mappings were kept in D1 seed/API/site settings.
- No raw JPEG logo was used.
- No ISOKO logo was used.
- No images or logos were copied into `apps/public-site`.
- Staff is not in the top navigation.
- Footer links are only Contact Us and Donate.
- No Reports link was added.
- No old HTML was restored as the live website.
- No admin authentication changes were made.
- No commit was made.

## Remaining Missing Details

- Real production payment/bank/mobile money details are still needed before publishing direct donation payment instructions.
- Human visual QA should confirm the impact count-up animation in a fresh browser session.

## Recommended Next Step

Run local preview and visually verify:

```powershell
pnpm --filter api dev
pnpm --filter public-site dev
```

Then check:

- `http://localhost:3000/`
- `http://localhost:3000/about`
- `http://localhost:3000/partners`
- `http://localhost:3000/contact`
- `http://localhost:3000/donate`
- `http://localhost:3000/impact`
