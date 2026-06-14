import type { Context } from "hono";
import { getDb, nowIso } from "./client";
import type { AppBindings } from "../types";

export type MediaStatus = "active" | "hidden" | "deleted";

export type MediaRow = {
  id: string;
  original_name: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  storage_key: string;
  public_url: string | null;
  alt_text: string | null;
  caption: string | null;
  entity_type: string | null;
  entity_id: string | null;
  display_order: number;
  status: MediaStatus;
  created_at: string;
  updated_at: string;
};

export type MediaCreateInput = {
  originalName: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storageKey: string;
  publicUrl: string | null;
  altText: string | null;
  caption: string | null;
  entityType: string | null;
  entityId: string | null;
  displayOrder: number;
};

export type MediaUpdateInput = {
  altText: string | null;
  caption: string | null;
  entityType: string | null;
  entityId: string | null;
  displayOrder: number;
  status: MediaStatus;
};

export type MediaListFilters = {
  entityType?: string | null;
  entityId?: string | null;
  status?: MediaStatus | null;
  q?: string | null;
};

const MEDIA_COLUMNS =
  "id, original_name, file_name, mime_type, size_bytes, storage_key, public_url, alt_text, caption, entity_type, entity_id, display_order, status, created_at, updated_at";

export async function listMediaFiles(
  c: Context<AppBindings>,
  filters: MediaListFilters
) {
  const conditions: string[] = ["status != ?"];
  const values: Array<string | number> = ["deleted"];

  if (filters.status) {
    conditions[0] = "status = ?";
    values[0] = filters.status;
  }

  if (filters.entityType) {
    conditions.push("entity_type = ?");
    values.push(filters.entityType);
  }

  if (filters.entityId) {
    conditions.push("entity_id = ?");
    values.push(filters.entityId);
  }

  if (filters.q) {
    conditions.push("(original_name LIKE ? OR file_name LIKE ? OR alt_text LIKE ? OR caption LIKE ?)");
    const query = `%${filters.q}%`;
    values.push(query, query, query, query);
  }

  const result = await getDb(c)
    .prepare(
      `SELECT ${MEDIA_COLUMNS} FROM media_files WHERE ${conditions.join(
        " AND "
      )} ORDER BY created_at DESC LIMIT 200`
    )
    .bind(...values)
    .all<MediaRow>();

  return result.results ?? [];
}

export async function findMediaById(c: Context<AppBindings>, id: string) {
  const row = await getDb(c)
    .prepare(`SELECT ${MEDIA_COLUMNS} FROM media_files WHERE id = ? LIMIT 1`)
    .bind(id)
    .first<MediaRow>();

  return row ?? null;
}

export async function createMediaFile(
  c: Context<AppBindings>,
  input: MediaCreateInput
) {
  const id = crypto.randomUUID();
  const now = nowIso();

  await getDb(c)
    .prepare(
      `INSERT INTO media_files (
        id, original_name, file_name, mime_type, size_bytes, storage_key,
        public_url, alt_text, caption, entity_type, entity_id, display_order,
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      input.originalName,
      input.fileName,
      input.mimeType,
      input.sizeBytes,
      input.storageKey,
      input.publicUrl,
      input.altText,
      input.caption,
      input.entityType,
      input.entityId,
      input.displayOrder,
      "active",
      now,
      now
    )
    .run();

  return findMediaById(c, id);
}

export async function updateMediaFile(
  c: Context<AppBindings>,
  id: string,
  input: MediaUpdateInput
) {
  const now = nowIso();

  await getDb(c)
    .prepare(
      `UPDATE media_files
       SET alt_text = ?, caption = ?, entity_type = ?, entity_id = ?,
           display_order = ?, status = ?, updated_at = ?
       WHERE id = ?`
    )
    .bind(
      input.altText,
      input.caption,
      input.entityType,
      input.entityId,
      input.displayOrder,
      input.status,
      now,
      id
    )
    .run();

  return findMediaById(c, id);
}

export async function markMediaDeleted(c: Context<AppBindings>, id: string) {
  const now = nowIso();
  const result = await getDb(c)
    .prepare("UPDATE media_files SET status = ?, updated_at = ? WHERE id = ? AND status != ?")
    .bind("deleted", now, id, "deleted")
    .run();

  return result.meta.changes > 0;
}
