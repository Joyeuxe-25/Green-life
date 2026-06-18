# Phase 15N: Public Site Polish Report

## Scope

Polished the public Green Life Rwanda website cards, icons, typography, partner links, Restore Local logo handling, footer SVG, and impact count animation.

## Files Changed

- `apps/public-site/app/globals.css`
- `apps/public-site/components/public-components.tsx`
- `apps/public-site/components/animated-impact-stat-card.tsx`
- `apps/public-site/components/site-footer.tsx`
- `apps/api/seeds/0001_initial_public_content.sql`
- `apps/api/scripts/import-brand-partner-logos-local.mjs`
- `docs/PHASE_15N_PUBLIC_SITE_POLISH_REPORT.md`

Local input asset added from the user-provided logo upload:

- `00_INPUTS/07_partner_logos/restore-local-logo.png`

No images or logos were copied into `apps/public-site`.

## Card Title And Font Changes

- Public card titles now use bold title styling via shared card CSS.
- Section and form/card headings also use stronger heading weight.
- Public typography now uses a modern NGO-friendly stack: `"Nunito Sans", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- No Google font runtime import was added, avoiding build/network risk.

## Icons Added

- Program cards now use contextual `lucide-react` icons:
  - Agroforestry: `Trees`
  - Climate Action: `CloudSun`
  - Youth Environmental Education: `GraduationCap`
  - Community Livelihoods: `HandHeart`
- Phase 15N addendum tightened the program icon resolver so seeded `icon_name` values such as `Sprout`, `Leaf`, `GraduationCap`, and `Handshake` cannot fall through to generic/repeated icons.
- Project cards now include contextual category icons.
- Impact stat cards now use contextual icons for farmers trained, trees planted, hectares restored, and nurseries.
- News, event, staff, contact, and support cards retain or now use clean lucide icons.
- No heavy icon package was added.

## Button Styling Addendum

- Header Donate, header Get Involved, hero buttons, and CTA buttons were resized to a clearer public-site button scale.
- Primary buttons now use dark green `#14532d` with cream text `#fffdf7`.
- Primary hover state uses `#166534`.
- Secondary buttons now use a cream/light background with dark green text and border.
- Important public buttons now share consistent pill radius, larger padding, stronger weight, and mobile-friendly minimum height.

## Text Fitting And Layout Fixes

- Cards use stronger wrapping, consistent line-height, compact gaps, and line clamp only for card summary text.
- Cards use wider responsive containers, with desktop max width around `1240px`.
- Mobile padding is about `20px`; tablet/desktop layouts expand without pushing cards to the screen edge.
- Mobile header overflow was fixed by constraining the nav/actions inside the header container.

## Partner Links

Partner website URLs were stored dynamically in API seed/import data, not hardcoded in React cards:

- RGB: `https://www.rgb.rw/`
- World Connect: `https://worldconnect-us.org/power-center/rwanda`
- Biocoor: `https://biocoor.org.rw/`
- Segal Family Foundation: `https://www.segalfamilyfoundation.org/`
- Bridge of Hope: `https://bridgeofhope.org.rw/`
- FMI Ubumuntu: `https://www.friendsofmotherland.org/`
- Restore Local: `https://restorelocal.org/`

Partner cards now link externally with `target="_blank"` and `rel="noopener noreferrer"`.

## Restore Local Logo Status

- The Restore Local logo was missing at first, so Codex stopped and asked for it.
- The user then provided the real Restore Local PNG.
- The provided logo was placed at `00_INPUTS/07_partner_logos/restore-local-logo.png`.
- The local media import script now registers `partner-restore-local-logo`.
- Local D1 verification confirmed:
  - `website_url = https://restorelocal.org/`
  - `is_text_only = 0`
  - `media_id = partner-restore-local-logo`
  - `public_url = http://localhost:8787/public/media/file/partner-restore-local-logo`

No fake partner logos were used.

## Footer SVG Status

- Added a lightweight inline SVG footer illustration with landscape lines, trees, branches, and small birds.
- Footer links remain only:
  - Contact Us
  - Donate
- Footer remains readable and lightweight on mobile.

## Impact Animation

- Count-up duration was slowed to a professional range:
  - around `2.8s` for smaller values
  - up to `3.9s` for large values
- Count-up runs once when the stat enters the viewport.
- `prefers-reduced-motion` is respected.
- Browser QA confirmed the final formatted large number renders as `329,425`.

## Testing

Command run:

```bash
pnpm --recursive typecheck
```

Result:

- Passed for `apps/admin-site`, `apps/api`, `apps/public-site`, and `packages/shared`.
- Initial sandboxed run failed with a `fetch failed` pnpm/sandbox error.
- Unsandboxed approved rerun passed.

## Visual QA

Manual browser QA was completed against local preview.

Checked:

- Homepage cards
- Homepage hero buttons
- Header Donate and Get Involved buttons
- What We Do / Our Areas of Work icons
- Programs page cards
- Projects page cards
- Partners page links and logos
- Impact count animation
- Footer SVG and birds
- Mobile layout at `390x844`

Results:

- Desktop partner cards showed bold titles, valid logo URLs, and external-safe links.
- What We Do cards displayed distinct visible icons for Agroforestry, Climate Action, Youth Environmental Education, and Community Livelihoods.
- Header and hero buttons rendered at the larger dark-green/cream button scale.
- Restore Local rendered through the API media URL.
- Homepage/programs/projects/impact/contact/donate cards had no detected card overflow.
- Mobile pages had no page-level horizontal overflow after the header nav fix.
- Footer SVG was present on checked pages.

## Guardrail Confirmations

- No admin-site code was changed for this phase.
- Auth was not changed.
- Old static HTML was not restored.
- No real organization content was hardcoded directly in React pages.
- Partner URLs were added through API seed/import data.
- No fake partner logos were used.
- Codex asked for the missing Restore Local logo before proceeding.
- No images or logos were copied into `apps/public-site`.
- No commit was made.
