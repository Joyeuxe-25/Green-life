# Phase 10D-F Remaining Admin Modules Report

## Files changed

- `apps/api/src/db/staff.ts`
- `apps/api/src/db/partners.ts`
- `apps/api/src/db/messages.ts`
- `apps/api/src/routes/admin-staff.ts`
- `apps/api/src/routes/admin-partners.ts`
- `apps/api/src/routes/admin-contact-messages.ts`
- `apps/api/src/routes/admin-donation-messages.ts`
- `apps/api/src/index.ts`
- `apps/admin-site/lib/admin-api.ts`
- `apps/admin-site/components/staff-form.tsx`
- `apps/admin-site/components/partner-form.tsx`
- `apps/admin-site/app/staff/page.tsx`
- `apps/admin-site/app/staff/add/page.tsx`
- `apps/admin-site/app/staff/update/page.tsx`
- `apps/admin-site/app/staff/update/[id]/page.tsx`
- `apps/admin-site/app/partners/page.tsx`
- `apps/admin-site/app/partners/add/page.tsx`
- `apps/admin-site/app/partners/update/page.tsx`
- `apps/admin-site/app/partners/update/[id]/page.tsx`
- `apps/admin-site/app/contact-messages/page.tsx`
- `apps/admin-site/app/donation-messages/page.tsx`
- `docs/PHASE_10D_F_REMAINING_ADMIN_MODULES_REPORT.md`

## Backend routes added

- `GET /admin/staff`
- `GET /admin/staff/:id`
- `POST /admin/staff`
- `PATCH /admin/staff/:id`
- `DELETE /admin/staff/:id`
- `GET /admin/partners`
- `GET /admin/partners/:id`
- `POST /admin/partners`
- `PATCH /admin/partners/:id`
- `DELETE /admin/partners/:id`
- `GET /admin/contact-messages`
- `GET /admin/contact-messages/:id`
- `PATCH /admin/contact-messages/:id/read`
- `PATCH /admin/contact-messages/:id/unread`
- `DELETE /admin/contact-messages/:id`
- `GET /admin/donation-messages`
- `GET /admin/donation-messages/:id`
- `PATCH /admin/donation-messages/:id/read`
- `PATCH /admin/donation-messages/:id/unread`
- `DELETE /admin/donation-messages/:id`

All admin routes use the existing `requireAdmin` middleware and return the existing `{ ok, data }` or `{ ok, error }` JSON envelope.

## Staff CRUD summary

Staff now has admin list, create, update, and soft-delete support. The admin UI includes loading, empty, error, edit, delete confirmation, and add/edit form states.

Schema fields used:

- `id`
- `full_name`
- `role_title`
- `short_bio`
- `email`
- `phone`
- `display_order`
- `status`
- `created_at`
- `updated_at`
- `deleted_at`

No `photo_url` column exists in the current schema, so no photo URL field was added.

## Partners CRUD summary

Partners now has admin list, create, update, and soft-delete support. The admin UI includes loading, empty, error, edit, delete confirmation, and add/edit form states.

Schema fields used:

- `id`
- `name`
- `slug`
- `website_url`
- `description`
- `display_order`
- `status`
- `is_text_only`
- `created_at`
- `updated_at`
- `deleted_at`

No `logo_url` column exists in the current schema, so no logo URL field was added.

## Contact messages admin view summary

Contact messages now have protected admin list, detail, soft-delete, mark-read, and mark-unread routes. The admin page includes sender, email, phone, subject, message preview, date, status, expandable details, read/unread action, delete confirmation, loading, empty, and error states.

Schema fields used:

- `id`
- `sender_name`
- `email`
- `phone`
- `subject`
- `message`
- `status`
- `created_at`
- `updated_at`
- `deleted_at`

Read/unread is supported through the existing `status` field using `read` and `new`.

## Donation messages admin view summary

Donation messages now have protected admin list, detail, soft-delete, mark-read, and mark-unread routes. The admin page includes donor name, email, phone, intended amount, message preview, date, status, expandable details, read/unread action, delete confirmation, loading, empty, and error states.

Schema fields used:

- `id`
- `donor_name`
- `email`
- `phone`
- `intended_amount`
- `message`
- `status`
- `created_at`
- `updated_at`
- `deleted_at`

Read/unread is supported through the existing `status` field using `read` and `new`.

## Confirmations

- No R2 or media upload implementation was added.
- No public-site files were modified.
- No old static HTML, CSS, or JS files were modified.
- No auth storage was added or changed.
- No migrations were applied or changed.
- No enhanced images or generated website mockup were used.

## Testing steps

Automated:

```bash
pnpm --recursive typecheck
```

Manual:

```bash
pnpm dev:api
pnpm dev:admin
```

Then:

- Log in to the admin site.
- Open `/staff`.
- Create a staff member.
- Edit the staff member.
- Delete the staff member.
- Open `/partners`.
- Create a partner.
- Edit the partner.
- Delete the partner.
- Open `/contact-messages`.
- Expand, mark read/unread, and delete a contact message if test data exists.
- Open `/donation-messages`.
- Expand, mark read/unread, and delete a donation message if test data exists.

## Known limitations

- Staff photo support is not available because the `staff` table has no `photo_url` column.
- Partner logo support is not available because the `partners` table has no `logo_url` column.
- Contact and donation pages do not send replies or emails.
- Donation messages do not process payments.
- Message list/detail views depend on existing submitted message rows.

## Recommended next phase

Proceed to media/R2 upload support and public API exposure after confirming these admin modules against a local or staging D1 database.
