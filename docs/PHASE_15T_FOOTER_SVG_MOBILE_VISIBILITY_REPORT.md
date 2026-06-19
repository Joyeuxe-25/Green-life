# Phase 15T Footer SVG Mobile Visibility Report

## Scope

Worked only on the public site footer styling:

- `apps/public-site/app/globals.css`

No admin-site, API, auth, database, content, or media import files were changed.

## Root Cause

The footer illustration was hidden in the base footer CSS:

- `.footer-illustration` used `display: none`.
- It was only shown again inside the `@media (min-width: 1120px)` desktop breakpoint.

This made the inline trees-and-birds SVG unavailable on phone and tablet widths even though the SVG markup was present in `apps/public-site/components/site-footer.tsx`.

## SVG Mobile Visibility Fix

Updated `.footer-illustration` so it is visible by default on mobile, tablet, and desktop:

- Changed base display to `display: block`.
- Set `width: 100%` and `min-width: 0` to avoid horizontal overflow.
- Let the illustration span the footer grid on smaller layouts with `grid-column: 1 / -1`.
- Kept the desktop four-column layout by resetting `grid-column: auto` at `1120px`.

## Responsive Behavior

The SVG now has explicit responsive sizing:

- Mobile/tablet height: `clamp(5rem, 26vw, 7.5rem)`.
- Desktop height: `clamp(7.5rem, 11vw, 10.5rem)`.
- SVG uses `display: block`, `width: 100%`, and `overflow: visible`.

This keeps the mobile height around 80px to 120px while allowing a slightly larger desktop illustration.

## Color and Contrast

The footer background is light cream/green, so the SVG colors were strengthened:

- Main trees use a stronger green.
- Small trees use a clearer soft green.
- Birds use a darker, higher-contrast green so they remain visible on mobile.

## Footer Content Status

Footer content was not changed. The footer still supports:

- Green Life Rwanda logo/name
- Summary
- Contact Us link
- Donate link
- Email
- Phone
- Location
- Copyright

Footer navigation links remain only:

- Contact Us
- Donate

## Mobile QA

CSS QA was checked for the requested mobile widths:

- `390px`: SVG is visible, uses full available width, and resolves within the 80px to 120px mobile height range.
- `430px`: SVG is visible with birds and trees using higher-contrast green.
- `768px`: SVG remains visible, spans the footer grid, and does not require horizontal scrolling.

The illustration appears after the footer content and before the copyright bar, so it does not cover footer text or links.

## Build and Typecheck

- `pnpm --filter public-site build`: Passed.
- `pnpm --recursive typecheck`: Passed.

The first sandboxed runs failed with `fetch failed`; both commands passed after rerunning with approved network access.

## Commit Status

No commit was made.
