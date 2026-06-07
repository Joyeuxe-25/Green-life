# API Migrations Notes

These migration files are reviewed schema files only until an approved phase applies them.

## Admin User

- No real admin password is seeded in this folder.
- Do not store plain passwords.
- Admin creation should be handled later with a secure setup script or a manual insert using a properly generated password hash.
- The project is locked to one admin user only.

## Partner Seed Planning

- Restore Local can be inserted later as a partner with `is_text_only = 1` until a logo is provided.
- Partner display spellings are locked as `Biocoor` and `FMI Ubumuntu` unless later corrected.

## Exclusions

- No reports table should be added.
- No activity logs table should be added.
- Do not use `about-team-meeting` in future media seed or upload plans.

## Applying Later

Do not run Wrangler D1 migration commands until explicitly approved.
