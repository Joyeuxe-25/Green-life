# Phase 15G: Legacy Content Audit And D1 Mapping Report

## Summary

Phase 15G reviewed the restored legacy static website in `legacy-static-site/` and mapped useful content/layout ideas into the current dynamic D1/Next.js content model.

This was an audit and planning phase only. No public-site, API, admin-site, auth, schema, seed, or runtime files were changed.

## Files Reviewed

Legacy static reference:

- `legacy-static-site/index.html`
- `legacy-static-site/about.html`
- `legacy-static-site/programs.html`
- `legacy-static-site/projects.html`
- `legacy-static-site/impact.html`
- `legacy-static-site/news.html`
- `legacy-static-site/contact.html`
- `legacy-static-site/donate.html`
- `legacy-static-site/get-involved.html`
- `legacy-static-site/js/shared.js`
- `legacy-static-site/css/global.css`
- `legacy-static-site/css/home.css`

Reports page:

- `legacy-static-site/reports.html` exists but was intentionally not used because Reports is removed from the approved future website.

Approved source/context:

- `00_INPUTS/01_content/GENERAL INFORMATION ON GREEN FOR LIFE RWANDA  26.05.2026.docx`
- `docs/PHASE_1_CONTENT_MEDIA_AUDIT_REPORT.md`
- `docs/PHASE_5_CONTENT_MODEL_FORM_PLAN.md`
- `docs/PHASE_15B_INITIAL_CONTENT_MEDIA_POPULATION_REPORT.md`
- `docs/PHASE_15C_ENHANCED_IMAGE_VISIBILITY_REPORT.md`
- `docs/PHASE_15D_PUBLIC_CONTENT_IMAGES_LOGOS_AND_CARDS_FIX_REPORT.md`

D1/API structure:

- `apps/api/migrations/0001_initial_schema.sql`
- `apps/api/migrations/0002_site_content_management.sql`
- `apps/api/migrations/0003_media_library_updates.sql`
- `apps/api/seeds/0001_initial_public_content.sql`

## Content Found

Homepage:

- Full-image hero with environmental positioning, primary/secondary calls to action, and strong project imagery.
- Intro section describing GLR as community-based environmental action.
- What We Do cards for agroforestry, climate action, advocacy, and youth environmental clubs.
- Impact highlight cards.
- Testimonials/community voices.
- Featured activities and latest updates.
- Final support/get involved CTAs.

About:

- Hero with founding/location metadata.
- Mission/purpose style content.
- Approach/value cards.
- Focus areas.
- History timeline-style content.
- CTA to programs, get involved, and contact.

Programs:

- Program hero and integrated approach overview.
- Program cards for agroforestry, climate action, youth environmental education, and community livelihoods.
- Practical activities such as compost production, natural pesticides, tree nursery management, and farmer training.
- Beneficiary sections for farmers, youth/students, communities, and women's groups.

Projects:

- Hero and overview on turning ideas into action.
- Project-style cards for tree nursery, compost, natural pesticides, youth clubs, agroforestry, and community environmental days.
- Detailed highlight sections for field activities.

Impact:

- Hero and overview about measuring impact through community action.
- Legacy stats: 19 saving groups, 353 members, 45 farmers trained, youth clubs active.
- Community empowerment and youth engagement sections.
- Practical action cards.

News:

- Featured news about Nyanza environmental club members trained in sustainable agroforestry practices.
- Multiple "Coming Soon" article cards.
- Events empty state.
- Media resources/photo grid.

Contact:

- Email, phone, social links, location, contact form, specific inquiries, and map.
- Legacy contact details include `greenforliferwanda@gmail.com`, `+250-788-487-932`, and Huye/Mukura/Rango location.

Donate:

- Donation rationale and impact tier cards.
- Bank transfer details.
- Donation inquiry form.
- Donation impact cards.

Get Involved:

- Volunteer, internship, community participation, partnership, and donation pathways.
- Useful section order for participation pages.

Header/footer:

- Header includes logo, dropdown navigation, donate button, and mobile menu pattern.
- Footer includes logo, short organization summary, social links, quick links, contact details, support CTA, copyright, and quote.

## Content To Keep

Keep and map through D1:

- Clear homepage flow: hero, mission preview, programs, impact, projects, partners/news/events preview, CTA.
- Mission, vision, history, and founding/legal registration facts from approved docs.
- Four program pillars: Agroforestry Promotion, Climate Action, Youth Environmental Education, Community Livelihoods.
- Practical activity concepts: tree nurseries, seedling distribution, composting, natural pest control, school environmental clubs, savings groups, farmer training.
- Approved impact numbers:
  - 350 smallholder farmers trained
  - 329,425 trees planted
  - 365 hectares restored
  - Permanent tree nurseries established
- Approved projects:
  - Mushonyi Community-Led Restoration in Rutsiro District
  - Environmental Clubs in Sustainable Agroforestry in Gisagara District
  - School Greening and Environmental Education in Gisagara District
- Partners:
  - World Connect
  - Biocoor
  - Segal Family Foundation
  - RGB
  - Bridge of Hope
  - FMI Ubumuntu
  - Restore Local as text-only
- Footer concept: logo, summary, quick links, contact/social/support content.

## Content To Improve Or Rewrite Slightly

Rewrite before production:

- Legacy "Who We Are" homepage/about wording should be folded into mission, values, history, or an approved overview block. Do not re-add the old About "Who We Are" section unless the user approves it.
- "Mainstream Advocacy" and "Gender Livelihood and Advocacy" should be modernized under approved program language: climate action, environmental awareness/advocacy, women empowerment, and community livelihoods.
- Legacy testimonials/community quotes should be treated as unsourced and used only if the user confirms them.
- Legacy donation tiers and dollar amounts should be reviewed before publication.
- Legacy project cards should be replaced or reframed by the approved three project records.
- News "Coming Soon" cards should be removed from real content and handled as empty states until real news exists.
- Contact/social/bank details should be verified before production use.

## Content To Remove

Remove or avoid:

- Reports page and Reports navigation.
- Old About "Who We Are" section unless explicitly approved later.
- Fake or placeholder news cards.
- Placeholder social links using `#`.
- Any unverified bank transfer details.
- Any unverified donation amount claims.
- Old impact numbers that conflict with approved impact numbers:
  - 19 saving groups
  - 353 members
  - 45 farmers trained
- Any layout/content that depends on old root `.html`, `css/`, `js/`, or `assets/` paths.
- Old static forms that only simulate success client-side.

## Outdated Content

Likely outdated or superseded:

- Huye/Mukura/Rango contact/location details unless the user confirms they are current.
- Bank of Kigali account details unless the user confirms they are current and safe for publication.
- 2023 news item should be verified before becoming a published news record.
- "Coming Soon" news/event content should not become real database content.
- Legacy staff photos/content should not be used to hardcode staff; staff must remain admin-managed.

## Missing Content Needed From User

No required audit source file is missing for Phase 15G.

Before production content publication, user confirmation is still needed for:

- Current official phone number.
- Current official email.
- Current physical address/location.
- Current social media links.
- Donation/payment/bank details.
- Whether legacy 2023 news content should be imported as a real news item.
- Whether any legacy testimonials/quotes are approved for publication.
- Whether the About "Who We Are" section should remain removed.

## D1 Mapping Table

| Legacy/public content | D1 target | Notes |
| --- | --- | --- |
| Homepage hero | `content_blocks` | `page_key='home'`, `block_key='hero'`, `block_type='hero'`, use `image_url` from media. |
| Homepage mission/intro | `content_blocks` | Prefer approved mission language; avoid reintroducing old About Who We Are section. |
| Homepage CTA | `content_blocks` | `block_type='cta'`; labels/hrefs can be seed-managed. |
| Mission | `content_blocks` | `page_key='about'`, `block_key='mission'`. |
| Vision | `content_blocks` | `page_key='about'`, `block_key='vision'`. |
| History | `content_blocks` | `page_key='about'`, `block_key='history'`; include 2017, 2021, ISAE Busogo origin if approved. |
| Core values / approach | `content_blocks` | Can be page blocks on About or Programs; may need structured block convention. |
| What We Do / program pillars | `programs` | Four approved program rows. |
| Practical activities | `content_blocks` or `programs.body` | Composting, natural pesticides, nurseries, trainings can enrich program body/content blocks. |
| Impact numbers | `impact_stats` | Use approved 350, 329,425, 365, permanent nurseries. |
| Approved projects | `projects` | Three approved projects with status/category/impact summary. |
| Legacy project-style activities | `content_blocks` or future project details | Do not duplicate as fake project rows unless approved. |
| News featured story | `news` | Only if user confirms this is approved/current. |
| Events empty state | React UI label only | Safe as UI empty state; do not seed fake events. |
| Partners | `partners` | Existing approved partner records; logos through `media_files`. |
| Staff | `staff` | Admin-managed only; never hardcode. |
| Contact intro/details | `content_blocks` and `site_settings` | Confirm official email/phone/address first. |
| Contact form submissions | `contact_messages` | Runtime form endpoint/admin view; not seed content. |
| Donation page text | `content_blocks` and `site_settings` | Avoid unverified bank/payment details. |
| Donation form submissions | `donation_messages` | Runtime form endpoint/admin view; not seed content. |
| Get involved pathways | `content_blocks` | Volunteer, internships, partnerships, community participation. |
| Footer summary | `site_settings` | `footer.summary`. |
| Footer contact/social links | `site_settings` | Use separate keys for confirmed phone/email/socials. |
| Images and public media | `media_files` | Use R2/media flow; attach by URL or entity type/id. |
| Partner logos | `media_files` | `entity_type='partner'`, `entity_id=partners.id`. |
| Site logo/favicon | `media_files` and `site_settings` | `site.logo_url`, `site.favicon_url`. |

## Hardcoding Decision

Safe to hardcode in React:

- Navigation labels.
- Button labels when generic UI commands.
- Form labels.
- Empty-state labels.
- UI section labels such as "Projects", "News", "Events", "Partners".
- Layout/component structure.

Must not be hardcoded in React:

- Mission.
- Vision.
- History.
- Program descriptions.
- Impact numbers.
- Project content.
- News content.
- Event content.
- Partner names/logos.
- Staff.
- Footer organization text.
- Contact/donation/get-involved real content.
- Media/image paths.

Acceptable in seed/import scripts:

- Approved starter content used to populate D1.
- Approved image/logo import mappings.
- Stable IDs/slugs for content records.

## Legacy Layout Ideas To Reuse

Useful section order:

- Homepage: hero -> intro/mission -> programs -> impact -> projects/activities -> partners/news/events preview -> support CTA.
- About: hero -> mission/vision -> values/approach -> history -> CTA.
- Programs: hero -> overview -> four program cards -> practical activities -> beneficiaries -> CTA.
- Projects: hero -> project overview -> cards -> detailed highlights.
- Impact: hero -> impact stats -> narrative sections -> practical action cards -> CTA.
- Get involved: hero -> why it matters -> ways to help -> volunteer/donate/partner sections -> CTA.
- Contact/donate: hero -> practical info cards -> form -> supporting details -> CTA.

Useful UI ideas:

- Donate button as a persistent high-priority nav action.
- Footer grouped into summary, quick links, contact, and support.
- Cards with image, title, short description, and one action link.
- Impact cards with large numbers and short explanations.
- CTA bands near page ends.
- Page-specific hero images from the media library.

## Design Problems To Avoid

Modernize away from:

- Full 100vh heroes on every page.
- Oversized card images.
- Dense pages with too many competing sections.
- Dark-heavy overlays and heavy green blocks.
- Too many decorative quotes/testimonials without approval.
- Font/icon dependency on external CDN for core rendering.
- Static dropdown menus with Reports links.
- Client-only fake form success behavior.
- Placeholder `#` links.
- Hardcoded static image paths.

Preferred modern direction:

- Smaller, controlled hero heights.
- Lighter color balance using the approved palette.
- Clean responsive grids.
- Consistent card image ratios.
- Partner logos with `object-contain`.
- Photos with `object-cover`.
- Better whitespace and shorter text blocks.
- Dynamic content from D1/public API.

## Recommended Next Phase

Proceed to:

```text
Phase 15H Logo and Favicon Asset Preparation
```

Recommended focus:

- Prepare the Green Life Rwanda logo and favicon as production-ready media assets.
- Confirm final logo variants, sizes, and formats.
- Confirm partner logo handling and missing Restore Local logo status.
- Keep all logos/images in media/R2 flow, not in `apps/public-site`.
