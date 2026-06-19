# Phase 15U Mobile Sidebar All Links Fix Report

## Scope

Worked only in:

- `apps/public-site`
- `docs`

No admin-site, API, database, auth, content, or media import files were changed.

## Files Changed

- `apps/public-site/app/globals.css`
- `apps/public-site/.env.local` for local verification only
- `docs/PHASE_15U_MOBILE_SIDEBAR_ALL_LINKS_FIX_REPORT.md`

## Root Cause

The mobile sidebar did render the normal link list, but the mobile breakpoint used this broad selector:

```css
.site-header nav,
.nav-actions {
  display: none;
}
```

Because the mobile sidebar lives inside `.site-header`, that selector also hid the sidebar's internal `<nav className="mobile-menu-nav">`. The result was that only the action button section could appear.

## Rendering Fix

The CSS selector now hides only the direct desktop nav in the header:

```css
.header-inner > nav,
.nav-actions {
  display: none;
}
```

This keeps the desktop nav hidden on mobile while allowing `.mobile-menu-nav` inside the sidebar to render normally.

## Sidebar Content Verified

The mobile sidebar now shows the normal links first:

- Home
- About
- Programs
- Projects
- Impact
- Partners
- News
- Events
- Contact

Then the action buttons:

- Donate
- Get Involved

## Button Styling

Donate is visible as a full-width button with:

- Dark green background
- Cream/white text
- Bold styling
- 48px rendered height in local verification

Get Involved is visible as a full-width button with:

- Cream/light background
- Dark green text
- Dark green border
- 48px rendered height in local verification

## Sidebar Layout and Scroll

The sidebar keeps:

- `height: 100dvh`
- `overflow-y: auto`
- `overflow-x: hidden`
- No horizontal document overflow

## Local Verification

`apps/public-site/.env.local` was updated for local verification:

```env
NEXT_PUBLIC_API_BASE_URL=https://green-life-rwanda-api.movie-night-api.workers.dev
```

The requested dev command was run:

```bash
pnpm --filter public-site dev -- --hostname 0.0.0.0
```

The dev server required approved network access to fetch the deployed API. Headless browser verification was then completed against the local site. Because the first dev run left a port process active and browser automation was lower-level in this environment, the final stable viewport checks were completed against the locally built/served public site after `pnpm --filter public-site build`.

Checked widths:

- `390px`: hamburger present, sidebar opens, all links visible, Donate/Get Involved visible, no Staff, no Reports, no horizontal overflow.
- `430px`: hamburger present, sidebar opens, all links visible, Donate/Get Involved visible, no Staff, no Reports, no horizontal overflow.
- `768px`: hamburger present, sidebar opens, all links visible, Donate/Get Involved visible, no Staff, no Reports, no horizontal overflow.

At 390px, verified link list:

```text
Home, About, Programs, Projects, Impact, Partners, News, Events, Contact
```

At 430px and 768px, each nav link rendered as visible flex rows with 44px height, and each action button rendered as visible flex buttons with 48px height.

## Phone Testing Note

To test on phone before committing, run the public site with hostname `0.0.0.0`, find the laptop IPv4 address using `ipconfig`, then open `http://LAPTOP-IP:3000` on a phone connected to the same Wi-Fi.

## Build and Typecheck

- `pnpm --filter public-site build`: Passed after approved network access.
- `pnpm --recursive typecheck`: Passed after approved network access.

## Commit Status

No commit was made.
