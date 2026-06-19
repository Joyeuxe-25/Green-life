# Phase 15S Public Mobile Navbar Sidebar Report

## Scope

Phase 15S fixed the public-site mobile navbar responsiveness only.

Changed files:

- `apps/public-site/components/site-header.tsx`
- `apps/public-site/components/mobile-nav-menu.tsx`
- `apps/public-site/app/globals.css`
- `docs/PHASE_15S_PUBLIC_MOBILE_NAVBAR_SIDEBAR_REPORT.md`

No admin-site, API, auth, database, content, or media import files were changed.

## Desktop Navbar Behavior

- Desktop keeps the existing horizontal navbar and action buttons.
- Header remains dark green and clean.
- Desktop public nav remains:
  - Home
  - About
  - Programs
  - Projects
  - Impact
  - Partners
  - Contact
- Desktop action buttons remain:
  - Donate
  - Get Involved

## Mobile Sidebar Behavior

- Tablet/mobile hides the normal horizontal nav links and desktop action buttons below `900px`.
- A hamburger button appears with an accessible `aria-label`.
- Clicking the hamburger opens a right-side off-canvas sidebar.
- A dark transparent overlay appears behind the sidebar.
- Sidebar closes when:
  - clicking the overlay
  - clicking the close button
  - clicking a nav/action link
  - pressing Escape
- Body scrolling is locked while the sidebar is open.
- Motion is reduced when `prefers-reduced-motion: reduce` is active.

## Mobile Links Included

Mobile sidebar links:

- Home
- About
- Programs
- Projects
- Impact
- Partners
- News
- Events
- Contact

Mobile sidebar buttons:

- Donate
- Get Involved

Donate and Get Involved are styled as stronger touch-friendly buttons inside the sidebar.

## Staff/Reports Confirmation

- Staff is not included in desktop navigation.
- Staff is not included in mobile navigation.
- Reports is not included in desktop navigation.
- Reports is not included in mobile navigation.

## Branding

- The mobile sidebar header uses the existing dynamic processed logo URL when available.
- No real organization content was hardcoded.
- No images were copied into `apps/public-site`.

## Testing

`pnpm --filter public-site build`

- Initial sandbox run failed with pnpm `fetch failed`.
- Approved rerun succeeded.
- Next.js build compiled successfully.

`pnpm --recursive typecheck`

- Initial sandbox run failed with pnpm `fetch failed`.
- Approved rerun succeeded.
- `apps/public-site`, `apps/admin-site`, `apps/api`, and `packages/shared` passed `tsc --noEmit`.

Source/manual checks:

- Desktop navbar remains present in source.
- Mobile hamburger/sidebar code is present.
- Mobile nav includes required links.
- Staff and Reports are absent from nav source.
- Old mobile horizontal-scroll nav CSS was removed.

## Git/Commit

- No commit was made.
