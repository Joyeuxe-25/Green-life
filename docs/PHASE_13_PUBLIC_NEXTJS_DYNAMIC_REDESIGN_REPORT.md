# Phase 13 Public Next.js Dynamic Redesign Report

## Files changed

- `apps/public-site/.env.local.example`
- `apps/public-site/lib/public-api.ts`
- `apps/public-site/components/public-components.tsx`
- `apps/public-site/components/site-header.tsx`
- `apps/public-site/components/site-footer.tsx`
- `apps/public-site/components/page-shell.tsx`
- `apps/public-site/app/globals.css`
- `apps/public-site/app/layout.tsx`
- `apps/public-site/app/page.tsx`
- `apps/public-site/app/about/page.tsx`
- `apps/public-site/app/programs/page.tsx`
- `apps/public-site/app/projects/page.tsx`
- `apps/public-site/app/projects/[slug]/page.tsx`
- `apps/public-site/app/impact/page.tsx`
- `apps/public-site/app/news/page.tsx`
- `apps/public-site/app/news/[slug]/page.tsx`
- `apps/public-site/app/events/page.tsx`
- `apps/public-site/app/events/[slug]/page.tsx`
- `apps/public-site/app/staff/page.tsx`
- `apps/public-site/app/partners/page.tsx`
- `apps/public-site/app/donate/page.tsx`
- `apps/public-site/app/contact/page.tsx`
- `apps/public-site/app/get-involved/page.tsx`
- `docs/PHASE_13_PUBLIC_NEXTJS_DYNAMIC_REDESIGN_REPORT.md`

## Pages redesigned

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

## Components created or updated

- Public API helper: `apps/public-site/lib/public-api.ts`
- Shared display components: `apps/public-site/components/public-components.tsx`
- Site header
- Site footer
- Page hero
- Section heading
- Cards
- Impact stat card
- CTA section
- Empty state
- Media image

## Dynamic content behavior

All redesigned pages fetch from Phase 12 public API endpoints using `NEXT_PUBLIC_API_BASE_URL`.

The pages render published/active API content when available and neutral empty states when no public records exist.

Media is displayed only from API-provided URLs such as content block `image_url`; no enhanced image assets are copied into or referenced from the public app.

## Styling

The redesign uses the approved Option 3 palette:

- Primary Green `#2E7D4F`
- Leaf Green `#63A84F`
- Fresh Accent `#A7D46F`
- Warm Cream `#F8F4E8`
- Soft White `#FFFDF7`
- Earth Gold `#C28A3D`
- Text Dark `#1D2A22`
- Muted Text `#667265`

## Confirmations

- No reports navigation link was added.
- No hardcoded staff content was added.
- No hardcoded real public content was added.
- No banned image was used.
- No enhanced image was hardcoded into React pages.
- No images were copied into `apps/public-site`.
- Old static HTML/CSS/JS files were not modified or removed.
- No admin-site work was done.
- No API CRUD, auth, or R2 upload work was done.
- No commit was made.

## Testing steps

Run typecheck:

```bash
pnpm --recursive typecheck
```

Start the API and public site:

```bash
pnpm --filter api dev
pnpm --filter public-site dev
```

Set local public API URL:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8787
```

Manual browser checks:

- Open `/`
- Open `/about`
- Open `/programs`
- Open `/projects`
- Open a project detail route with a known public slug
- Open `/impact`
- Open `/news`
- Open a news detail route with a known published slug
- Open `/events`
- Open an event detail route with a known public slug
- Open `/staff`
- Open `/partners`
- Open `/donate`
- Open `/contact`
- Open `/get-involved`

## Known limitations

- Pages depend on Phase 12 API availability at runtime.
- Pages with no published data show empty states.
- Detail pages require known public slugs from the API.
- Media picker integration in admin content forms remains a later phase.

## Recommended next phase

Populate admin-managed content/media, verify the public API responses, then do browser QA on the redesigned public site with real published records from D1/R2.
