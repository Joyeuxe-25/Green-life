# Phase 15R Remote Media Import Report

## Scope

Phase 15R prepared and attempted remote media import for the deployed Cloudflare API:

- Worker URL: `https://green-life-rwanda-api.movie-night-api.workers.dev`
- Remote D1 database: `green-life-rwanda`
- Remote R2 bucket: `green-life-rwanda-media`
- Media table: `media_files`

No public-site design, admin-site design, auth logic, or app image folders were changed.

## Scripts Created

- `apps/api/scripts/import-enhanced-media-remote.mjs`
- `apps/api/scripts/import-brand-partner-logos-remote.mjs`

These scripts are remote-focused versions of the local import helpers. They use:

- `wrangler r2 object put ... --remote`
- `wrangler d1 execute green-life-rwanda --remote --file ...`
- deployed public media URLs under `https://green-life-rwanda-api.movie-night-api.workers.dev/public/media/file/:id`

## Windows Upload Path Fix

The remote import scripts were patched after a Windows Wrangler argument parsing failure on partner logo filenames with spaces, such as `world connect.JPG`.

Current behavior:

- Each upload source is staged into `apps/api/.tmp-remote-media-upload/`.
- Staged filenames use safe media IDs without spaces.
- Wrangler is called with `execFileSync(pnpmCommand, ["exec", "wrangler", ...args])`.
- No joined `cmd.exe` command string is used.
- The same safe staging helper is used for:
  - processed GLR logo/favicon uploads
  - partner logo uploads
  - enhanced media uploads
- D1 writes remain idempotent with `ON CONFLICT(id) DO UPDATE` for `media_files` and `ON CONFLICT(key) DO UPDATE` for `site_settings`.

## Windows Wrangler Runner Fix

The remote scripts were patched again after Windows reported:

```text
spawnSync pnpm.cmd EINVAL
```

Current Windows runner behavior:

- The scripts do not directly spawn `pnpm.cmd`.
- On Windows, Wrangler runs through:
  - `cmd.exe /d /s /c pnpm exec wrangler ...`
- Upload files still use staged safe filenames under `apps/api/.tmp-remote-media-upload/`.
- Non-Windows environments still use `execFileSync("pnpm", ["exec", "wrangler", ...args])`.

Phase 15R should not be considered complete until both remote scripts run successfully and the required remote media URL checks return `200`.

## Source Folders Used

Required sources were checked and found:

- `00_INPUTS/05_enhanced_avif_media/Green_Life_Rwanda_Enhanced_AVIF_Media.zip`
- `00_INPUTS/05_enhanced_avif_media/extracted/assets/images`
- `00_INPUTS/05_enhanced_avif_media/enhanced-media-import-manifest.json`
- `00_INPUTS/06_green_life_logo/processed/`
- `00_INPUTS/04_partner_logos/originals/`
- `00_INPUTS/07_partner_logos/restore-local-logo.png`

No required source file was missing.

## Remote R2 Upload Result

Remote R2 upload is blocked.

The first enhanced-media run failed in sandbox with a pnpm fetch error. The approved rerun exposed two important facts:

- Wrangler R2 requires `--remote`; without it Wrangler reports `Resource location: local`.
- The scripts were patched to include `--remote` for R2 uploads.

After patching, remote R2 upload still cannot be completed because this non-interactive environment has no `CLOUDFLARE_API_TOKEN`.

Wrangler error:

```text
Failed to fetch auth token: 400 Bad Request
In a non-interactive environment, it's necessary to set a CLOUDFLARE_API_TOKEN environment variable for wrangler to work.
```

## Remote D1 Media Registration Result

Remote D1 media registration is blocked for the same reason:

- `CLOUDFLARE_API_TOKEN` is not set.
- Wrangler cannot run remote D1 operations non-interactively without it.

No remote D1 media registration was completed.

## Enhanced Image Status

The remote enhanced-media script is ready to upload/register all 30 AVIF images from the enhanced media manifest.

Important IDs covered include:

- `enhanced-community-seedling-training`
- `enhanced-tree-nursery-landscape`
- `enhanced-fruit-tree-plantation`
- `enhanced-tree-planting-demonstration`
- `enhanced-farmers-with-grevillea-seedlings`
- all other manifest AVIF images

The script also updates page/content image references and attaches project/news/event media where applicable.

## GLR Logo/Favicon Status

The remote brand/partner script is ready to upload and register:

- `green-life-logo-transparent.webp`
- `green-life-logo-transparent.png`
- `green-life-logo-footer-transparent.png`
- `green-life-favicon.ico`
- `green-life-favicon-32.png`
- `green-life-favicon-48.png`
- `green-life-apple-touch-icon.png`
- `green-life-favicon-192.png`
- `green-life-favicon-512.png`

It updates remote site settings:

- `site.logo_url`
- `site.footer_logo_url`
- `site.favicon_url`
- `site.favicon_32_url`
- `site.favicon_48_url`
- `site.apple_touch_icon_url`
- `site.icon_192_url`
- `site.icon_512_url`

Remote upload/registration remains blocked by missing `CLOUDFLARE_API_TOKEN`.

## Partner Logo Status

The remote brand/partner script is ready to upload and attach real logos for:

- World Connect
- Biocoor
- Segal Family Foundation
- RGB
- Bridge of Hope
- FMI Ubumuntu
- Restore Local

No fake logos or placeholders are used.

Remote upload/registration remains blocked by missing `CLOUDFLARE_API_TOKEN`.

## Restore Local Logo Status

Restore Local source file was found:

- `00_INPUTS/07_partner_logos/restore-local-logo.png`

The remote script maps it to:

- media ID: `partner-restore-local-logo`
- entity type: `partner`
- entity ID: `partner-restore-local`
- partner website: `https://restorelocal.org/`

Remote upload/registration remains blocked by missing `CLOUDFLARE_API_TOKEN`.

## Project Image Attachment Status

The remote enhanced-media script is ready to attach:

- `project-mushonyi-restoration` -> `grevillea-seedlings-for-planting.avif`
- `project-nyanza-environmental-clubs` -> `tree-nursery-group.avif`
- `project-school-greening` -> `youth-community-seedling-training.avif`

Remote verification currently shows all three project `image_url` values are still `null`.

## Page Hero Image Status

The remote enhanced-media script updates hero/content block image URLs for:

- home hero
- projects intro hero
- partners intro hero
- programs intro hero
- impact intro hero
- contact intro hero
- donate intro hero
- get-involved intro hero
- about mission/history sections

Remote content already contains some hero image URL references, but those media IDs currently return 404 until R2/media_files import succeeds.

## Verification Results

Remote HEAD checks after the blocked import attempt:

```text
/public/media/file/enhanced-community-seedling-training -> 404 Not Found
/public/media/file/media-green-life-logo-transparent-webp -> 404 Not Found
/public/media/file/media-green-life-favicon-ico -> 404 Not Found
```

Remote `/public/projects`:

- API returns project records.
- `image_url` is `null` for all three projects.

Remote `/public/partners`:

- API returns partner records.
- Partner website URLs are present.
- `logo_url` is `null` for all partners, including Restore Local.

Remote `/public/site-settings`:

- Site logo/favicon setting values are present.
- The referenced media IDs still return 404.

## Missing Files

No required image/logo source files were missing.

Missing runtime credential:

- `CLOUDFLARE_API_TOKEN`

## Next Step To Finish Import

Set a Cloudflare API token with permissions for the target account/resources, then rerun:

```powershell
$env:CLOUDFLARE_API_TOKEN="YOUR_TOKEN"
node apps/api/scripts/import-enhanced-media-remote.mjs
node apps/api/scripts/import-brand-partner-logos-remote.mjs
```

Then rerun the required curl checks.

## Safety Confirmations

- `00_INPUTS` was not committed.
- No images were copied into `apps/public-site`.
- No images were copied into `apps/admin-site`.
- No fake logos were used.
- No placeholder logos were used.
- No `.env.local` files were committed.
- `apps/api/.dev.vars` was not committed.
- No commit was made.
