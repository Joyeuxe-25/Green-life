import type { Context } from "hono";
import { getDb, nowIso } from "./client";
import type { AppBindings } from "../types";

export type PublishStatus = "draft" | "published";

export type ContentBlockRow = {
  id: string;
  page_key: string;
  block_key: string;
  block_type: string;
  eyebrow: string | null;
  title: string | null;
  subtitle: string | null;
  summary: string | null;
  body: string | null;
  cta_label: string | null;
  cta_href: string | null;
  secondary_cta_label: string | null;
  secondary_cta_href: string | null;
  image_url: string | null;
  display_order: number;
  status: PublishStatus;
  created_at: string;
  updated_at: string;
};

export type ContentBlockInput = {
  pageKey: string;
  blockKey: string;
  blockType: string;
  eyebrow: string | null;
  title: string | null;
  subtitle: string | null;
  summary: string | null;
  body: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  secondaryCtaLabel: string | null;
  secondaryCtaHref: string | null;
  imageUrl: string | null;
  displayOrder: number;
  status: PublishStatus;
};

const CONTENT_BLOCK_COLUMNS =
  "id, page_key, block_key, block_type, eyebrow, title, subtitle, summary, body, cta_label, cta_href, secondary_cta_label, secondary_cta_href, image_url, display_order, status, created_at, updated_at";

export async function listContentBlocks(c: Context<AppBindings>) {
  const result = await getDb(c)
    .prepare(
      `SELECT ${CONTENT_BLOCK_COLUMNS} FROM content_blocks ORDER BY page_key ASC, display_order ASC, block_key ASC LIMIT 300`
    )
    .all<ContentBlockRow>();

  return result.results ?? [];
}

export async function findContentBlockById(c: Context<AppBindings>, id: string) {
  const row = await getDb(c)
    .prepare(`SELECT ${CONTENT_BLOCK_COLUMNS} FROM content_blocks WHERE id = ? LIMIT 1`)
    .bind(id)
    .first<ContentBlockRow>();

  return row ?? null;
}

export async function createContentBlock(
  c: Context<AppBindings>,
  input: ContentBlockInput
) {
  const id = crypto.randomUUID();
  const now = nowIso();

  await getDb(c)
    .prepare(
      `INSERT INTO content_blocks (
        id, page_key, block_key, block_type, eyebrow, title, subtitle, summary,
        body, cta_label, cta_href, secondary_cta_label, secondary_cta_href,
        image_url, display_order, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      input.pageKey,
      input.blockKey,
      input.blockType,
      input.eyebrow,
      input.title,
      input.subtitle,
      input.summary,
      input.body,
      input.ctaLabel,
      input.ctaHref,
      input.secondaryCtaLabel,
      input.secondaryCtaHref,
      input.imageUrl,
      input.displayOrder,
      input.status,
      now,
      now
    )
    .run();

  return findContentBlockById(c, id);
}

export async function updateContentBlock(
  c: Context<AppBindings>,
  id: string,
  input: ContentBlockInput
) {
  const now = nowIso();

  await getDb(c)
    .prepare(
      `UPDATE content_blocks
       SET page_key = ?, block_key = ?, block_type = ?, eyebrow = ?, title = ?,
           subtitle = ?, summary = ?, body = ?, cta_label = ?, cta_href = ?,
           secondary_cta_label = ?, secondary_cta_href = ?, image_url = ?,
           display_order = ?, status = ?, updated_at = ?
       WHERE id = ?`
    )
    .bind(
      input.pageKey,
      input.blockKey,
      input.blockType,
      input.eyebrow,
      input.title,
      input.subtitle,
      input.summary,
      input.body,
      input.ctaLabel,
      input.ctaHref,
      input.secondaryCtaLabel,
      input.secondaryCtaHref,
      input.imageUrl,
      input.displayOrder,
      input.status,
      now,
      id
    )
    .run();

  return findContentBlockById(c, id);
}

export async function deleteContentBlock(c: Context<AppBindings>, id: string) {
  const result = await getDb(c)
    .prepare("DELETE FROM content_blocks WHERE id = ?")
    .bind(id)
    .run();

  return result.meta.changes > 0;
}
