# Phase 15U Mobile Sidebar Buttons Visibility Report

## Scope

Worked only on the public site mobile sidebar styling:

- `apps/public-site/app/globals.css`

No admin-site, API, database, auth, or content files were changed.

## Root Cause

The mobile sidebar already rendered the Donate and Get Involved links, but the action section used `margin-top: auto` inside a full-height flex sidebar. On shorter mobile screens this could push the action buttons to the bottom of the panel, making them easy to miss or effectively hidden below the visible area.

## Button Visibility Fix

The mobile menu action section now appears directly after the regular nav links:

- Home
- About
- Programs
- Projects
- Impact
- Partners
- News
- Events
- Contact
- Donate
- Get Involved

The action section no longer relies on `margin-top: auto`. Buttons are full width, bold, and at least 48px tall:

- Donate uses dark green background with cream text.
- Get Involved uses cream/light background, dark green text, and dark green border.

## Mobile Sidebar Scroll Behavior

The sidebar panel keeps `height: 100dvh` and now explicitly uses:

- `box-sizing: border-box`
- `overflow-y: auto`
- `overflow-x: hidden`
- `overscroll-behavior: contain`

This keeps the close button and menu content usable while allowing the sidebar to scroll if screen height is too short.

## Navigation Safety

Confirmed the mobile nav source does not include:

- Staff
- Reports

The mobile nav still includes News and Events, as required.

## Mobile QA

CSS/source QA was checked for:

- `390px`: panel width uses `min(21rem, calc(100vw - 1.1rem))`, action buttons are full width and visible after Contact.
- `430px`: panel width remains within viewport, buttons retain strong contrast and touch height.
- `768px`: mobile sidebar remains active under the `899px` breakpoint, with no horizontal overflow and scroll enabled if needed.

## Build and Typecheck

- `pnpm --filter public-site build`: Passed.
- `pnpm --recursive typecheck`: Passed.

The first sandboxed runs failed with `fetch failed`; both commands passed after rerunning with approved network access.

## Commit Status

No commit was made.
