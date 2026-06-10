import type { Context } from "hono";
import { getDb, nowIso } from "./client";
import type { AppBindings, SafeAdmin } from "../types";

type AdminRow = SafeAdmin & {
  password_hash: string;
  is_active: number;
};

type CreateAdminInput = {
  name: string;
  email: string;
  passwordHash: string;
};

function toSafeAdmin(row: AdminRow): SafeAdmin {
  return {
    id: row.id,
    name: row.name,
    email: row.email
  };
}

export async function findActiveAdminByEmail(
  c: Context<AppBindings>,
  email: string
) {
  const row = await getDb(c)
    .prepare(
      "SELECT id, name, email, password_hash, is_active FROM admin WHERE lower(email) = lower(?) AND is_active = 1 LIMIT 1"
    )
    .bind(email)
    .first<AdminRow>();

  return row ?? null;
}

export async function findActiveAdminById(c: Context<AppBindings>, id: string) {
  const row = await getDb(c)
    .prepare(
      "SELECT id, name, email, password_hash, is_active FROM admin WHERE id = ? AND is_active = 1 LIMIT 1"
    )
    .bind(id)
    .first<AdminRow>();

  return row ?? null;
}

export async function countActiveAdmins(c: Context<AppBindings>) {
  const row = await getDb(c)
    .prepare("SELECT COUNT(*) AS count FROM admin WHERE is_active = 1")
    .first<{ count: number }>();

  return Number(row?.count ?? 0);
}

export async function createAdmin(
  c: Context<AppBindings>,
  input: CreateAdminInput
) {
  const now = nowIso();
  const id = crypto.randomUUID();

  await getDb(c)
    .prepare(
      "INSERT INTO admin (id, name, email, password_hash, password_updated_at, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 1, ?, ?)"
    )
    .bind(
      id,
      input.name,
      input.email,
      input.passwordHash,
      now,
      now,
      now
    )
    .run();

  return {
    id,
    name: input.name,
    email: input.email
  };
}

export async function updateAdminLastLogin(c: Context<AppBindings>, id: string) {
  const now = nowIso();
  await getDb(c)
    .prepare("UPDATE admin SET last_login_at = ?, updated_at = ? WHERE id = ?")
    .bind(now, now, id)
    .run();
}

export async function updateAdminPasswordHash(
  c: Context<AppBindings>,
  id: string,
  passwordHash: string
) {
  const now = nowIso();
  await getDb(c)
    .prepare(
      "UPDATE admin SET password_hash = ?, password_updated_at = ?, updated_at = ? WHERE id = ?"
    )
    .bind(passwordHash, now, now, id)
    .run();
}

export function safeAdmin(row: AdminRow) {
  return toSafeAdmin(row);
}
