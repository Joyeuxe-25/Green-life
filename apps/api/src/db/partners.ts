import type { Context } from "hono";
import { getDb, nowIso } from "./client";
import type { AppBindings } from "../types";

export type PartnerStatus = "active" | "hidden";

export type PartnerRow = {
  id: string;
  name: string;
  slug: string;
  website_url: string | null;
  description: string | null;
  display_order: number;
  status: PartnerStatus;
  is_text_only: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type PartnerInput = {
  name: string;
  slug: string;
  websiteUrl: string | null;
  description: string | null;
  displayOrder: number;
  status: PartnerStatus;
  isTextOnly: boolean;
};

const PARTNER_COLUMNS =
  "id, name, slug, website_url, description, display_order, status, is_text_only, created_at, updated_at, deleted_at";

export async function listPartners(c: Context<AppBindings>) {
  const result = await getDb(c)
    .prepare(
      `SELECT ${PARTNER_COLUMNS} FROM partners WHERE deleted_at IS NULL ORDER BY display_order ASC, name ASC LIMIT 100`
    )
    .all<PartnerRow>();

  return result.results ?? [];
}

export async function findPartnerById(c: Context<AppBindings>, id: string) {
  const row = await getDb(c)
    .prepare(`SELECT ${PARTNER_COLUMNS} FROM partners WHERE id = ? AND deleted_at IS NULL LIMIT 1`)
    .bind(id)
    .first<PartnerRow>();

  return row ?? null;
}

export async function findPartnerBySlug(c: Context<AppBindings>, slug: string) {
  const row = await getDb(c)
    .prepare("SELECT id FROM partners WHERE slug = ? AND deleted_at IS NULL LIMIT 1")
    .bind(slug)
    .first<{ id: string }>();

  return row ?? null;
}

export async function createPartner(c: Context<AppBindings>, input: PartnerInput) {
  const id = crypto.randomUUID();
  const now = nowIso();

  await getDb(c)
    .prepare(
      `INSERT INTO partners (
        id, name, slug, website_url, description, display_order, status,
        is_text_only, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      input.name,
      input.slug,
      input.websiteUrl,
      input.description,
      input.displayOrder,
      input.status,
      input.isTextOnly ? 1 : 0,
      now,
      now
    )
    .run();

  return findPartnerById(c, id);
}

export async function updatePartner(
  c: Context<AppBindings>,
  id: string,
  input: PartnerInput
) {
  const now = nowIso();

  await getDb(c)
    .prepare(
      `UPDATE partners
       SET name = ?, slug = ?, website_url = ?, description = ?, display_order = ?,
           status = ?, is_text_only = ?, updated_at = ?
       WHERE id = ? AND deleted_at IS NULL`
    )
    .bind(
      input.name,
      input.slug,
      input.websiteUrl,
      input.description,
      input.displayOrder,
      input.status,
      input.isTextOnly ? 1 : 0,
      now,
      id
    )
    .run();

  return findPartnerById(c, id);
}

export async function softDeletePartner(c: Context<AppBindings>, id: string) {
  const now = nowIso();
  const result = await getDb(c)
    .prepare("UPDATE partners SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL")
    .bind(now, now, id)
    .run();

  return result.meta.changes > 0;
}
