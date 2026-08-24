import type { Context } from "hono";
import { getDb, nowIso } from "./client";
import type { AppBindings } from "../types";

export type StaffStatus = "active" | "hidden";

export type StaffRow = {
  id: string;
  full_name: string;
  role_title: string;
  short_bio: string | null;
  email: string | null;
  phone: string | null;
  display_order: number;
  status: StaffStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  image_url: string | null;
  image_alt_text: string | null;
  image_caption: string | null;
};

export type StaffInput = {
  fullName: string;
  roleTitle: string;
  shortBio: string | null;
  email: string | null;
  phone: string | null;
  displayOrder: number;
  status: StaffStatus;
};

const STAFF_COLUMNS = `id, full_name, role_title, short_bio, email, phone, display_order, status, created_at, updated_at, deleted_at,
  (SELECT public_url FROM media_files WHERE entity_type = 'staff' AND entity_id = staff.id AND status = 'active' ORDER BY display_order ASC, created_at ASC LIMIT 1) AS image_url,
  (SELECT alt_text FROM media_files WHERE entity_type = 'staff' AND entity_id = staff.id AND status = 'active' ORDER BY display_order ASC, created_at ASC LIMIT 1) AS image_alt_text,
  (SELECT caption FROM media_files WHERE entity_type = 'staff' AND entity_id = staff.id AND status = 'active' ORDER BY display_order ASC, created_at ASC LIMIT 1) AS image_caption`;

export async function listStaff(c: Context<AppBindings>) {
  const result = await getDb(c)
    .prepare(
      `SELECT ${STAFF_COLUMNS} FROM staff WHERE deleted_at IS NULL ORDER BY display_order ASC, full_name ASC LIMIT 100`
    )
    .all<StaffRow>();

  return result.results ?? [];
}

export async function findStaffById(c: Context<AppBindings>, id: string) {
  const row = await getDb(c)
    .prepare(`SELECT ${STAFF_COLUMNS} FROM staff WHERE id = ? AND deleted_at IS NULL LIMIT 1`)
    .bind(id)
    .first<StaffRow>();

  return row ?? null;
}

export async function createStaff(c: Context<AppBindings>, input: StaffInput) {
  const id = crypto.randomUUID();
  const now = nowIso();

  await getDb(c)
    .prepare(
      `INSERT INTO staff (
        id, full_name, role_title, short_bio, email, phone, display_order,
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      input.fullName,
      input.roleTitle,
      input.shortBio,
      input.email,
      input.phone,
      input.displayOrder,
      input.status,
      now,
      now
    )
    .run();

  return findStaffById(c, id);
}

export async function updateStaff(
  c: Context<AppBindings>,
  id: string,
  input: StaffInput
) {
  const now = nowIso();

  await getDb(c)
    .prepare(
      `UPDATE staff
       SET full_name = ?, role_title = ?, short_bio = ?, email = ?, phone = ?,
           display_order = ?, status = ?, updated_at = ?
       WHERE id = ? AND deleted_at IS NULL`
    )
    .bind(
      input.fullName,
      input.roleTitle,
      input.shortBio,
      input.email,
      input.phone,
      input.displayOrder,
      input.status,
      now,
      id
    )
    .run();

  return findStaffById(c, id);
}

export async function softDeleteStaff(c: Context<AppBindings>, id: string) {
  const now = nowIso();
  const result = await getDb(c)
    .prepare("UPDATE staff SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL")
    .bind(now, now, id)
    .run();

  return result.meta.changes > 0;
}
