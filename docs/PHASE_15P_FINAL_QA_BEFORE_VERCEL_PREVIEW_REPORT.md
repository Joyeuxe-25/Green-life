# Phase 15P Final QA Before Vercel Preview Report

## Scope

Final QA was performed for public site, admin site, API wiring, media/form paths, forbidden content searches, and Vercel preview readiness. No deployment or commit was performed.

Small QA fix made:

- Removed hardcoded localhost fallback from frontend API helpers:
  - `apps/public-site/lib/public-api.ts`
  - `apps/admin-site/lib/admin-api.ts`
  - `apps/admin-site/lib/admin-brand-assets.ts`

Local development still uses `NEXT_PUBLIC_API_BASE_URL` through `.env.local` / `.env.local.example`.

## Public Pages Checked

Routes confirmed by build output:

- `/`
- `/about`
- `/programs`
- `/projects`
- `/impact`
- `/partners`
- `/news`
- `/events`
- `/donate`
- `/contact`
- `/get-involved`
- `/staff`

Source-level QA confirmed:

- Header navigation is clean.
- Staff is not in public top navigation.
- Reports link is not present in public header/footer.
- Footer links are only `Contact Us` and `Donate`.
- Staff appears inside the About page.
- `/staff` route still exists.
- Logo and favicon are loaded from dynamic site settings/media URLs.
- Footer SVG illustration with trees and birds exists.
- Cards use shared card components with titles rendered as headings.
- Program/project/news/event/partner cards include icons or media/logo handling.
- Project and partner pages use dynamic hero blocks/images from API content.
- Public image/logo assets are not copied into `apps/public-site/public`.

Browser visual QA limitation:

- In-app browser connection timed out twice.
- Local public/API checks also timed out in this session.
- Full visual QA for hero clarity, mobile layout, count animation behavior, and external link opening should be repeated in a running local or preview environment.

## Public Forms Checked

Source-level QA confirmed:

- Contact form uses `submitContactMessage`.
- Donation form uses `submitDonationMessage`.
- Public API exposes:
  - `POST /public/contact-messages`
  - `POST /public/donation-messages`
- API DB mapping inserts into:
  - `contact_messages`
  - `donation_messages`

Live form submission limitation:

- Local API endpoint checks timed out, so contact/donation success messages, error messages, and D1 writes could not be verified live in this session.

No payment numbers, bank details, or Mobile Money details were added.

## Public API QA

Source-level endpoint check confirmed public routes for:

- home content
- about content
- programs
- projects
- impact stats
- partners
- news
- events
- staff
- site settings
- media list
- media file serving
- contact messages
- donation messages

Media/data mapping confirmed in source:

- Projects, news, and events include image URL metadata.
- Partners include logo URL metadata and website URLs.
- Site settings include logo/favicon/media URL keys.

Live endpoint limitation:

- `http://127.0.0.1:8787/public/home` timed out locally, so live API payloads could not be sampled.

## Admin Pages Checked

Routes confirmed by admin build output:

- `/login`
- `/dashboard`
- `/news/update`
- `/news/add`
- `/events/update`
- `/events/add`
- `/projects/update`
- `/projects/add`
- `/staff/update`
- `/staff/add`
- `/partners/update`
- `/partners/add`
- `/contact-messages`
- `/donation-messages`
- `/media`
- `/change-password`

Source-level QA confirmed:

- Admin logo/favicons use processed media URLs.
- Navbar has live date/time component.
- Sidebar has desktop collapse state.
- Mobile sidebar overlay remains present.
- Sidebar modules are title-first.
- Dropdown children use `Update` and `Add New`.
- Required dropdowns do not use `All`.
- Profile icon/menu exists in navbar.
- Profile menu exists at sidebar bottom.
- Profile menu displays safe admin details from existing session data.
- Change Password is inside profile menu.
- Logout action uses a logout icon and still calls existing logout flow.

Live admin limitation:

- Local admin browser QA could not be completed because browser automation timed out and local admin server was not reachable in this session.

## Admin Upload Checks

Source-level QA confirmed upload support for:

- Add News
- Update News
- Add Event
- Update Event
- Add Project
- Update Project

Behavior confirmed in code:

- Image field accepts AVIF, JPEG, PNG, and WebP.
- Preview is shown for selected/current image.
- Replacement uses `replaceEntityImage`.
- Removal uses `removeEntityImages`.
- Upload uses existing media upload API and `media_files`.
- Images are not stored as base64 in D1.
- Images are not copied into `apps/admin-site`.
- Public API row mapping returns uploaded image URL metadata.

Live upload limitation:

- Upload, replacement, removal, and public-site display could not be verified live because authenticated admin/API runtime was not reachable.

## Partner Link Checks

Dynamic seed/import mapping contains:

- RGB: `https://www.rgb.rw/`
- World Connect: `https://worldconnect-us.org/power-center/rwanda`
- Biocoor: `https://biocoor.org.rw/`
- Segal Family Foundation: `https://www.segalfamilyfoundation.org/`
- Bridge of Hope: `https://bridgeofhope.org.rw/`
- FMI Ubumuntu: `https://www.friendsofmotherland.org/`
- Restore Local: `https://restorelocal.org/`

Partner cards use `target="_blank"` and `rel="noopener noreferrer"` for external links.

## Restore Local Logo Status

- Restore Local logo is mapped through `apps/api/scripts/import-brand-partner-logos-local.mjs`.
- Expected source remains `00_INPUTS/07_partner_logos/restore-local-logo.png`.
- No fake Restore Local logo is used.
- No logo is copied into public/admin app folders.

## Favicon/Logo Status

- Public logo/favicon are dynamically loaded from site settings/media URLs.
- Admin logo/favicon use processed Green Life media URLs.
- No raw JPEG logo is used by React code.
- No ISOKO logo usage was found in live frontend app code.

## Footer Status

- Footer links are only:
  - Contact Us
  - Donate
- Footer SVG trees/birds component exists.
- Footer keeps dynamic logo/contact/social settings.

## Staff Location Status

- Staff is not in public top navigation.
- Staff appears on the About page.
- `/staff` route still exists and builds successfully.

## Forbidden Search Results

Searches checked:

- raw JPEG logo usage
- ISOKO logo usage
- Reports link
- hardcoded localhost in production frontend helpers
- copied image/logo files in app public folders
- base64 image storage
- Staff in public top navigation
- old static HTML restored as live site

Findings:

- Hardcoded localhost fallback was found in frontend API helpers and fixed.
- `localhost` remains only in `.env.local.example`, local `.env.local`, and local/import scripts.
- `base64` appears only in auth/password/session utilities, not image storage.
- No images/logos are present in `apps/public-site/public` or `apps/admin-site/public`.
- `legacy-static-site/` exists as an untracked reference folder, not as the live app.

## Build And Typecheck

`pnpm --filter public-site build`

- Initial sandbox run failed with pnpm `fetch failed`.
- Approved rerun succeeded.
- Next build compiled successfully.

`pnpm --filter admin-site build`

- Initial sandbox run failed with pnpm `fetch failed`.
- Approved rerun succeeded.
- Next build compiled successfully.

`pnpm --recursive typecheck`

- Initial sandbox run failed with pnpm `fetch failed`.
- Approved rerun succeeded.
- `apps/admin-site`, `apps/api`, `apps/public-site`, and `packages/shared` passed `tsc --noEmit`.

## Deployment Readiness

Vercel public preview readiness:

- `apps/public-site/.env.local.example` exists.
- It uses `NEXT_PUBLIC_API_BASE_URL`.
- Production frontend helpers no longer hardcode localhost fallback.
- Vercel root directory should be `apps/public-site`.
- Framework should be Next.js.
- Set `NEXT_PUBLIC_API_BASE_URL` to the deployed Cloudflare API base URL before preview deployment.

Required API deployment notes:

- Cloudflare API must be deployed and reachable before Vercel preview QA.
- API must have D1/R2 bindings configured.
- Brand/logo/media import flow must be applied to the target environment.
- Partner logo/media records must exist in target D1/R2, including Restore Local.
- CORS must allow the Vercel preview origin for public form submissions.

## Git Safety Result

- `git diff --cached --name-only` returned no staged files.
- Sensitive path status check for these paths returned no staged entries:
  - `00_INPUTS/`
  - `apps/api/.dev.vars`
  - `apps/admin-site/.env.local`
  - `apps/public-site/.env.local`
  - `cookies.txt`
- No commit was made.

Note:

- `next build` briefly changed generated `next-env.d.ts` references. The content was restored; Git still reported line-ending warnings for those files in this Windows workspace.

## Remaining Issues

- Live browser visual QA was blocked by browser automation timeout.
- Local API/public/admin runtime checks were blocked by timeout/refused local ports.
- Contact/donation live submission and admin media upload should be verified again against a running local or preview stack.
- Vercel preview requires the deployed Cloudflare API URL and target D1/R2 media data before final signoff.
