import type { Context } from "hono";
import { getDb, nowIso } from "./client";
import type { AppBindings } from "../types";

export type NewsStatus = "draft" | "published" | "archived";

export type NewsRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string | null;
  published_at: string | null;
  status: NewsStatus;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type NewsInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string | null;
  publishedAt: string | null;
  status: NewsStatus;
  seoTitle: string | null;
  seoDescription: string | null;
};

const NEWS_COLUMNS =
  "id, title, slug, excerpt, content, category, published_at, status, seo_title, seo_description, created_at, updated_at, deleted_at";

export async function listNews(c: Context<AppBindings>) {
  const result = await getDb(c)
    .prepare(
      `SELECT ${NEWS_COLUMNS} FROM news WHERE deleted_at IS NULL ORDER BY updated_at DESC, created_at DESC LIMIT 100`
    )
    .all<NewsRow>();

  return result.results ?? [];
}

export async function findNewsById(c: Context<AppBindings>, id: string) {
  const row = await getDb(c)
    .prepare(`SELECT ${NEWS_COLUMNS} FROM news WHERE id = ? AND deleted_at IS NULL LIMIT 1`)
    .bind(id)
    .first<NewsRow>();

  return row ?? null;
}

export async function findNewsBySlug(c: Context<AppBindings>, slug: string) {
  const row = await getDb(c)
    .prepare("SELECT id FROM news WHERE slug = ? AND deleted_at IS NULL LIMIT 1")
    .bind(slug)
    .first<{ id: string }>();

  return row ?? null;
}

export async function createNews(c: Context<AppBindings>, input: NewsInput) {
  const id = crypto.randomUUID();
  const now = nowIso();

  await getDb(c)
    .prepare(
      `INSERT INTO news (
        id, title, slug, excerpt, content, category, published_at, status,
        seo_title, seo_description, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      input.title,
      input.slug,
      input.excerpt,
      input.content,
      input.category,
      input.publishedAt,
      input.status,
      input.seoTitle,
      input.seoDescription,
      now,
      now
    )
    .run();

  return findNewsById(c, id);
}

export async function updateNews(
  c: Context<AppBindings>,
  id: string,
  input: NewsInput
) {
  const now = nowIso();

  await getDb(c)
    .prepare(
      `UPDATE news
       SET title = ?, slug = ?, excerpt = ?, content = ?, category = ?,
           published_at = ?, status = ?, seo_title = ?, seo_description = ?,
           updated_at = ?
       WHERE id = ? AND deleted_at IS NULL`
    )
    .bind(
      input.title,
      input.slug,
      input.excerpt,
      input.content,
      input.category,
      input.publishedAt,
      input.status,
      input.seoTitle,
      input.seoDescription,
      now,
      id
    )
    .run();

  return findNewsById(c, id);
}

export async function softDeleteNews(c: Context<AppBindings>, id: string) {
  const now = nowIso();
  const result = await getDb(c)
    .prepare("UPDATE news SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL")
    .bind(now, now, id)
    .run();

  return result.meta.changes > 0;
}
