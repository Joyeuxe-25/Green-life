# Phase 0 Project Preparation Report

Date: 2026-06-06

Scope: inspection, backup, and reporting only. No development, rebuild, content migration, media replacement, package installation, backend work, or database work was started.

## Project Structure Summary

The project is currently a static HTML/CSS/JavaScript website. There is no `package.json`, no framework configuration, and no Next.js/TypeScript project structure in the current working copy.

### HTML Files

- `about.html`
- `contact.html`
- `donate.html`
- `get-involved.html`
- `impact.html`
- `index.html`
- `news.html`
- `programs.html`
- `projects.html`
- `reports.html`
- `staff.html`

### CSS Files

- `css/about.css`
- `css/contact.css`
- `css/donate.css`
- `css/get-involved.css`
- `css/global.css`
- `css/home.css`
- `css/impact.css`
- `css/news.css`
- `css/programs.css`
- `css/projects.css`
- `css/reports.css`
- `css/responsive.css`
- `css/staff.css`

### JS Files

- `js/about.js`
- `js/contact.js`
- `js/donate.js`
- `js/get-involved.js`
- `js/home.js`
- `js/impact.js`
- `js/news.js`
- `js/programs.js`
- `js/projects.js`
- `js/shared.js`

### Asset Folders

- `assets/images`: current JPG/JPEG project and staff images.
- `assets/logos`: current site logo and favicon only.
- `assets/icons`: folder exists but is empty.

### Media And Video Folders

No dedicated video/media folder was found. No MP4, WebM, MOV, AVIF, SVG, PDF, XLSX, or DOCX files were found in the current workspace.

## Git Status Summary

- Repository: Git repository detected.
- Current branch: `main`
- Remote origin: `https://github.com/Joyeuxe-25/Green-life.git`
- Tracking: `main...origin/main`
- Working tree before report creation: clean according to `git status --short --branch`.
- Git warning observed: Git could not read `C:\Users\Hp/.config/git/ignore` due to permission denial. This did not show repository file changes.
- Latest commit: `b537fa3 Replace website images with Green Life Rwanda project photos`

## Backup Action Taken

Created backup branch:

- `phase-0-backup-before-rebuild`
- Backup branch commit: `b537fa375c74a17dcfe486058cb3c454947bd4a8`

The current working branch remains `main`.

## Page Inventory

### `index.html`

- Purpose: Home page.
- CSS: `css/global.css`, `css/home.css`, `css/responsive.css`
- JS: `js/shared.js`, `js/home.js`
- Major sections: hero, intro, focus areas, impact, testimonials, featured, quote strip, get involved, updates, final CTA.
- Images used: `community-seedling-training.jpg`, `tree-nursery-landscape.jpg`, `tree-planting-demonstration.jpg`, `tree-tomato-plantation.jpg`, `tree-nursery-group.jpg`, `farmers-with-grevillea-seedlings.jpg`, `home-hero.jpg`
- Internal links: `programs.html`, `get-involved.html`, `about.html`, `programs.html#trees`, `programs.html#climate`, `programs.html#advocacy`, `programs.html#gender`, `impact.html`, `projects.html`, `contact.html`, `news.html`

### `about.html`

- Purpose: About Green for Life Rwanda.
- CSS: `css/global.css`, `css/about.css`, `css/responsive.css`
- JS: `js/shared.js`, `js/about.js`
- Major sections: about hero, who we are/vision, mission and vision, values, focus areas, history, CTA.
- Images used: `about-team-meeting.jpg`, `nursery-community-work.jpg`, `community-seedling-training.jpg`, `tree-planting-demonstration.jpg`, `tree-tomato-plantation.jpg`, `fruit-tree-plantation.jpg`, `tree-nursery-group.jpg`, `env-club.jpg`
- Internal links: `programs.html`, `get-involved.html`, `contact.html`

### `programs.html`

- Purpose: Programs overview.
- CSS: `css/global.css`, `css/programs.css`, `css/responsive.css`
- JS: `js/shared.js`, `js/programs.js`
- Major sections: programs hero, overview, program areas, practical activities, beneficiaries, connect strip, CTA.
- Images used: `community-seedling-training.jpg`, `tree-nursery-landscape.jpg`, `tree-planting-demonstration.jpg`, `youth.jpg`, `fruit-tree-plantation.jpg`, `vegetable-garden-farmer.jpg`, `nursery-community-work.jpg`, `passion-fruit-farming.jpg`, `tree-tomato-plantation.jpg`, `home-hero.jpg`, `farmers-with-grevillea-seedlings.jpg`, `livestock-livelihood-support.jpg`
- Internal links: `projects.html`, `impact.html`, `get-involved.html`

### `projects.html`

- Purpose: Project listings and highlights.
- CSS: `css/global.css`, `css/projects.css`, `css/responsive.css`
- JS: `js/shared.js`, `js/projects.js`
- Major sections: projects hero, overview, featured projects, highlights, approach, CTA.
- Images used: `tree-nursery-landscape.jpg`, `community-seedling-training.jpg`, `vegetable-garden-farmer.jpg`, `nursery-community-work.jpg`, `env-club.jpg`, `tree-tomato-plantation.jpg`, `farmers-with-grevillea-seedlings.jpg`, `youth.jpg`, `passion-fruit-farming.jpg`
- Internal links: `programs.html`, `impact.html`, `get-involved.html`

### `impact.html`

- Purpose: Impact overview and outcomes.
- CSS: `css/global.css`, `css/impact.css`, `css/responsive.css`
- JS: `js/shared.js`, `js/impact.js`
- Major sections: impact hero, overview, highlights, community impact, youth engagement, field action, quote strip, CTA.
- Images used: `community-seedling-training.jpg`, `tree-tomato-plantation.jpg`, `farmers-with-grevillea-seedlings.jpg`, `vegetable-garden-farmer.jpg`, `nursery-community-work.jpg`, `tree-nursery-landscape.jpg`, `passion-fruit-farming.jpg`
- Internal links: `programs.html`, `projects.html`, `get-involved.html`

### `news.html`

- Purpose: News, updates, events, and media resources.
- CSS: `css/global.css`, `css/news.css`, `css/responsive.css`
- JS: `js/shared.js`, `js/news.js`
- Major sections: news hero, featured news, latest updates, community activities, events, media resources, CTA.
- Images used: `community-seedling-training.jpg`, `farmers-with-grevillea-seedlings.jpg`, `vegetable-garden-farmer.jpg`, `tree-planting-demonstration.jpg`, `nursery-community-work.jpg`, `tree-tomato-plantation.jpg`, `farmers-taking-grevillea.jpg`, `tree-nursery-landscape.jpg`, `youth.jpg`
- Internal links: `contact.html`, `projects.html`, `programs.html`, `get-involved.html`

### `get-involved.html`

- Purpose: Volunteer, community support, and partnership opportunities.
- CSS: `css/global.css`, `css/get-involved.css`, `css/responsive.css`
- JS: `js/shared.js`, `js/get-involved.js`
- Major sections: get involved hero, why involve, ways to get involved, volunteer, community/donate, partners, CTA.
- Images used: `community-seedling-training.jpg`, `tree-planting-demonstration.jpg`, `nursery-community-work.jpg`, `tree-nursery-inspection.jpg`, `farmers-with-grevillea-seedlings.jpg`, `about-team-meeting.jpg`, `fruit-tree-plantation.jpg`
- Internal links: `contact.html`, `programs.html`, `projects.html`

### `donate.html`

- Purpose: Donation information and impact.
- CSS: `css/global.css`, `css/donate.css`, `css/responsive.css`
- JS: `js/shared.js`, `js/donate.js`
- Major sections: donate hero, why donate, how to donate, donation impact, CTA.
- Images used: `community-seedling-training.jpg`, `tree-planting-demonstration.jpg`, `tree-nursery-landscape.jpg`, `livestock-livelihood-support.jpg`, `tree-tomato-plantation.jpg`, `vegetable-garden-farmer.jpg`
- Internal links: `get-involved.html`, `contact.html`, `programs.html`

### `contact.html`

- Purpose: Contact information, contact form, location, and CTA.
- CSS: `css/global.css`, `css/contact.css`, `css/responsive.css`
- JS: `js/shared.js`, `js/contact.js`
- Major sections: contact hero, contact overview, contact form, location, CTA.
- Images used: `about-team-meeting.jpg`, `community-seedling-training.jpg`
- Internal links: `donate.html`, `programs.html`, `get-involved.html`, `about.html`

### `reports.html`

- Purpose: Annual and other reports placeholder/download page.
- CSS: `css/global.css`, `css/reports.css`, `css/responsive.css`
- JS: `js/shared.js`
- Major sections: reports hero, reports intro, annual reports, other reports, request report, CTA.
- Images used: `about-team-meeting.jpg`, `community-seedling-training.jpg`, `tree-nursery-landscape.jpg`
- Internal links: `contact.html`, `impact.html`, `programs.html`, `projects.html`

### `staff.html`

- Purpose: Staff and board/team profile page.
- CSS: `css/global.css`, `css/staff.css`, `css/responsive.css`
- JS: `js/shared.js`
- Major sections: staff hero, staff intro, staff section, join CTA.
- Images used: `about-team-meeting.jpg`, `tree-tomato-plantation.jpg`, `speciose.JPG`, `juvens.JPG`, `sarah.JPG`, `anastasie.JPG`, `eugenie.JPG`, `community-seedling-training.jpg`
- Internal links: `get-involved.html`, `contact.html`

## Current Asset Inventory

### Current Images In `assets/images`

- `about-team-meeting.jpg`
- `anastasie.JPG`
- `community-field-activity.jpg`
- `community-seedling-training.jpg`
- `env-club.jpg`
- `eugenie.JPG`
- `farmer-in-vegetable-field.jpg`
- `farmers-taking-grevillea.jpg`
- `farmers-with-grevillea-seedlings.jpg`
- `fruit-tree-harvest.jpg`
- `fruit-tree-plantation.jpg`
- `grevillea-seedlings-for-planting.jpg`
- `harvesting-vegetables.jpg`
- `home-hero.jpg`
- `juvens.JPG`
- `livestock-livelihood-support.jpg`
- `nursery-community-work.jpg`
- `pacifique.JPG`
- `passion-fruit-farming.jpg`
- `sarah.JPG`
- `speciose.JPG`
- `tree-nursery-group.jpg`
- `tree-nursery-inspection.jpg`
- `tree-nursery-landscape.jpg`
- `tree-planting-demonstration.jpg`
- `tree-tomato-plantation.jpg`
- `vegetable-garden-farmer.jpg`
- `youth.jpg`

### Current Logos In `assets/logos`

- `favicon.png`
- `logo.jpg`

## Old Image Reference Findings

Search terms checked: `about-team-meeting`, `about-team-meeting.jpg`, `home-hero.jpg`, `env-club.jpg`, `youth.jpg`, `agroforestry.jpg`.

- `about-team-meeting.jpg` is used in `about.html`, `contact.html`, `get-involved.html`, `reports.html`, and `staff.html`.
- `home-hero.jpg` is used in `index.html` and `programs.html`.
- `env-club.jpg` is used in `about.html` and `projects.html`.
- `youth.jpg` is used in `news.html`, `programs.html`, and `projects.html`.
- `agroforestry.jpg` was not found.

## Selected AVIF Media Findings

No AVIF files were found in the current workspace. The selected AVIF media pack is not currently present in `assets/images` or in any separate folder inside this working copy.

Recommended future placement:

- Public website images: `public/media/images` or equivalent Next.js public media folder in Phase 1.
- Preserve a contact sheet or media guide under `docs/media` if supplied later.
- Keep original selected AVIF filenames descriptive, lowercase, and hyphenated.

## Video Asset Findings

No MP4, WebM, MOV, poster image pack, or video guide was found in the current workspace.

Recommended future placement:

- Videos: `public/media/videos`
- Posters: `public/media/posters`
- Any video guide: `docs/media`

## Partner Logo Findings

Only the current site logo and favicon exist in `assets/logos`. The expected partner logo files were not found in the current workspace.

Expected partners to confirm later:

- Biocoor
- Bridge of Hope
- FMI Ubuntu / FMI Ubumuntu
- RGB
- Segal Family Foundation
- World Connect
- Restore Local

Recommended clean filenames if assets are provided later:

- `biocoor.avif` or `biocoor.png`
- `bridge-of-hope.avif` or `bridge-of-hope.png`
- `fmi-ubuntu.avif` or `fmi-ubuntu.png`
- `rgb.avif` or `rgb.png`
- `segal-family-foundation.avif` or `segal-family-foundation.png`
- `world-connect.avif` or `world-connect.png`
- `restore-local.avif` or `restore-local.png`

Missing partner logos:

- All listed partner logos are currently missing from the workspace.
- Restore Local was specifically expected as possibly missing and was not found.

## New Content Document Summary

The document `GENERAL INFORMATION ON GREEN FOR LIFE RWANDA 26.05.2026.docx` was not found in the current workspace, so its contents could not be read or summarized directly during Phase 0.

Expected content mapping once the document is available:

- Home: likely provides updated introduction, headline, calls to action, and public-facing overview.
- Who We Are: likely organization identity, legal/community role, and narrative positioning.
- Mission: should become the authoritative mission statement.
- Vision: should become the authoritative vision statement.
- Core Values: should guide About page content and possibly homepage trust messaging.
- History: should map to the About page history/timeline.
- What We Do: should map to programs/services overview.
- Agroforestry Promotion: should map to a program/detail page section.
- Climate Action: should map to program and impact content.
- Youth Environmental Education: should map to program, projects, and news/event content.
- Community Livelihoods: should map to program, project, and impact sections.
- Projects: should map to project cards/details.
- Impact: should map to metrics, outcomes, stories, and evidence sections.
- Partners: should map to partner/logo sections and partnership content.
- News and Events: should map to news/event listing content.
- Get Involved: should map to volunteer, donate, contact, and partnership calls to action.

Warning: the exact wording and final information architecture should wait until the DOCX is available.

## Pages And Features That May Need Removal Later

### `reports.html`

- Exists in the current project.
- Linked from `js/shared.js` navigation as `Annual & Other Reports`.
- Included in `js/shared.js` hero page handling.
- Contains placeholder annual/other reports sections and disabled `#` download links.
- The approved future system has no reports feature, so this page and navigation entry should be reviewed for removal in a later phase.

No files were deleted in Phase 0.

## Risks And Warnings

- The supplied AVIF media pack, video asset pack, partner logos, and DOCX content document are not present in the current workspace.
- Current forms appear to be static/front-end only and will need backend planning in a later phase, but no backend work was started.
- `reports.html` exists even though the approved future system has no reports feature.
- Several current image files are large, especially `vegetable-garden-farmer.jpg`, `fruit-tree-harvest.jpg`, `about-team-meeting.jpg`, `youth.jpg`, and `home-hero.jpg`; future media optimization should be handled in the media migration phase.
- Partner logos are not available for validation, cleaning, or placement yet.
- The Git status command emitted a user-level Git ignore permission warning unrelated to repository content.

## Recommended Next Step For Phase 1

Before starting Phase 1, add the missing source inputs to the workspace or provide their paths:

- Selected AVIF media pack and guide/contact sheet.
- Video MP4, poster image, and video guide.
- Partner logos.
- `GENERAL INFORMATION ON GREEN FOR LIFE RWANDA 26.05.2026.docx`.

Once those inputs are available, Phase 1 should define the target content map and migration plan before beginning the Next.js rebuild.
