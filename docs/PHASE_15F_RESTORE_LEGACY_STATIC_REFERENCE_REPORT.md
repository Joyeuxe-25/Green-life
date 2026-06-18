# Phase 15F: Restore Legacy Static Reference Report

## Summary

The old Green Life Rwanda static website was restored from Git history as a reference-only artifact under:

```text
legacy-static-site/
```

The old HTML files were not restored to the repository root. The live website remains the Next.js app in `apps/public-site`.

## Source Used

The legacy static site was restored from the Git snapshot immediately before commit:

```text
09c23f0 Remove old static website files
```

Command approach:

- Created `legacy-static-site/`
- Used `git archive 09c23f0^` for the old static files/folders
- Extracted the archive directly into `legacy-static-site/`

## Files And Folders Restored

Root legacy pages restored inside `legacy-static-site/`:

- `legacy-static-site/index.html`
- `legacy-static-site/about.html`
- `legacy-static-site/programs.html`
- `legacy-static-site/projects.html`
- `legacy-static-site/impact.html`
- `legacy-static-site/news.html`
- `legacy-static-site/staff.html`
- `legacy-static-site/contact.html`
- `legacy-static-site/donate.html`
- `legacy-static-site/get-involved.html`
- `legacy-static-site/reports.html`

Legacy folders restored:

- `legacy-static-site/css/`
- `legacy-static-site/js/`
- `legacy-static-site/assets/`

CSS files restored:

- `about.css`
- `contact.css`
- `donate.css`
- `get-involved.css`
- `global.css`
- `home.css`
- `impact.css`
- `news.css`
- `programs.css`
- `projects.css`
- `reports.css`
- `responsive.css`
- `staff.css`

JS files restored:

- `about.js`
- `contact.js`
- `donate.js`
- `get-involved.js`
- `home.js`
- `impact.js`
- `news.js`
- `programs.js`
- `projects.js`
- `shared.js`

Asset folders restored:

- `legacy-static-site/assets/images/`
- `legacy-static-site/assets/logos/`

## Missing Old Files

The following requested examples were checked but were not present in the restored legacy snapshot:

- `events.html`
- `partners.html`

No separate legacy files for those pages were found in the old static site snapshot used for restoration.

## Confirmations

- The old static site was restored only into `legacy-static-site/`.
- No old `.html` files were restored to the repository root.
- `apps/public-site` was not changed for this phase.
- `apps/api` was not changed for this phase.
- `apps/admin-site` was not changed for this phase.
- Authentication was not changed.
- No commit was made.
- No typecheck was run because this phase restored reference-only static files and did not change code.

## Recommended Next Phase

Proceed to:

```text
Phase 15G Content Audit and D1 Mapping
```

Recommended focus:

- Compare `legacy-static-site/` layout/content against the current dynamic Next.js site.
- Identify which legacy layout ideas should become data-driven sections.
- Map any useful legacy content into D1-managed content blocks, projects, programs, impact stats, or site settings.
- Keep the legacy static site reference-only and never make it live again.
