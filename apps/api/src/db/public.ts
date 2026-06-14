import type { Context } from "hono";
import { getDb } from "./client";
import type { AppBindings } from "../types";

export type PublicPageKey =
  | "home"
  | "about"
  | "programs"
  | "impact"
  | "contact"
  | "donate"
  | "get-involved";

export type PublicContentBlock = {
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
};

export type PublicImpactStat = {
  id: string;
  label: string;
  value: string;
  suffix: string | null;
  description: string | null;
  display_order: number;
};

export type PublicProgram = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  body: string | null;
  icon_name: string | null;
  display_order: number;
};

export type PublicSiteSetting = {
  key: string;
  group_key: string;
  label: string;
  value: string | null;
  field_type: string;
};

export type PublicNewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  category: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PublicEventItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  category: string | null;
  status: string;
};

export type PublicProjectItem = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description?: string;
  district: string | null;
  sector: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  category: string | null;
  impact_summary: string | null;
};

export type PublicStaffMember = {
  id: string;
  full_name: string;
  role_title: string;
  short_bio: string | null;
  email: string | null;
  phone: string | null;
  display_order: number;
};

export type PublicPartner = {
  id: string;
  name: string;
  slug: string;
  website_url: string | null;
  description: string | null;
  display_order: number;
  is_text_only: number;
};

export type PublicMediaItem = {
  id: string;
  public_url: string | null;
  alt_text: string | null;
  caption: string | null;
  mime_type: string;
  entity_type: string | null;
  entity_id: string | null;
  display_order: number;
  created_at: string;
};

const CONTENT_BLOCK_COLUMNS =
  "id, page_key, block_key, block_type, eyebrow, title, subtitle, summary, body, cta_label, cta_href, secondary_cta_label, secondary_cta_href, image_url, display_order";
const IMPACT_STAT_COLUMNS =
  "id, label, value, suffix, description, display_order";
const PROGRAM_COLUMNS =
  "id, title, slug, summary, body, icon_name, display_order";
const SITE_SETTING_COLUMNS = "key, group_key, label, value, field_type";
const NEWS_LIST_COLUMNS =
  "id, title, slug, excerpt, category, published_at, created_at, updated_at";
const NEWS_DETAIL_COLUMNS =
  "id, title, slug, excerpt, content, category, published_at, created_at, updated_at";
const EVENT_COLUMNS =
  "id, title, slug, description, event_date, start_time, end_time, location, category, status";
const PROJECT_LIST_COLUMNS =
  "id, title, slug, summary, district, sector, start_date, end_date, status, category, impact_summary";
const PROJECT_DETAIL_COLUMNS =
  "id, title, slug, summary, description, district, sector, start_date, end_date, status, category, impact_summary";
const STAFF_COLUMNS =
  "id, full_name, role_title, short_bio, email, phone, display_order";
const PARTNER_COLUMNS =
  "id, name, slug, website_url, description, display_order, is_text_only";
const MEDIA_COLUMNS =
  "id, public_url, alt_text, caption, mime_type, entity_type, entity_id, display_order, created_at";

export async function listPublishedContentBlocks(
  c: Context<AppBindings>,
  pageKey: PublicPageKey
) {
  const result = await getDb(c)
    .prepare(
      `SELECT ${CONTENT_BLOCK_COLUMNS}
       FROM content_blocks
       WHERE page_key = ? AND status = ?
       ORDER BY display_order ASC, block_key ASC`
    )
    .bind(pageKey, "published")
    .all<PublicContentBlock>();

  return result.results ?? [];
}

export async function listPublishedImpactStats(c: Context<AppBindings>, limit = 100) {
  const result = await getDb(c)
    .prepare(
      `SELECT ${IMPACT_STAT_COLUMNS}
       FROM impact_stats
       WHERE status = ?
       ORDER BY display_order ASC, label ASC
       LIMIT ?`
    )
    .bind("published", limit)
    .all<PublicImpactStat>();

  return result.results ?? [];
}

export async function listPublishedPrograms(c: Context<AppBindings>, limit = 100) {
  const result = await getDb(c)
    .prepare(
      `SELECT ${PROGRAM_COLUMNS}
       FROM programs
       WHERE status = ?
       ORDER BY display_order ASC, title ASC
       LIMIT ?`
    )
    .bind("published", limit)
    .all<PublicProgram>();

  return result.results ?? [];
}

export async function listPublicSiteSettings(c: Context<AppBindings>) {
  const result = await getDb(c)
    .prepare(
      `SELECT ${SITE_SETTING_COLUMNS}
       FROM site_settings
       ORDER BY group_key ASC, key ASC`
    )
    .all<PublicSiteSetting>();

  return result.results ?? [];
}

export async function listPublishedNews(c: Context<AppBindings>, limit = 100) {
  const result = await getDb(c)
    .prepare(
      `SELECT ${NEWS_LIST_COLUMNS}
       FROM news
       WHERE status = ? AND deleted_at IS NULL
       ORDER BY COALESCE(published_at, created_at) DESC
       LIMIT ?`
    )
    .bind("published", limit)
    .all<PublicNewsItem>();

  return result.results ?? [];
}

export async function findPublishedNewsBySlug(c: Context<AppBindings>, slug: string) {
  const row = await getDb(c)
    .prepare(
      `SELECT ${NEWS_DETAIL_COLUMNS}
       FROM news
       WHERE slug = ? AND status = ? AND deleted_at IS NULL
       LIMIT 1`
    )
    .bind(slug, "published")
    .first<PublicNewsItem>();

  return row ?? null;
}

export async function listPublicEvents(c: Context<AppBindings>, limit = 100) {
  const result = await getDb(c)
    .prepare(
      `SELECT ${EVENT_COLUMNS}
       FROM events
       WHERE status IN (?, ?) AND deleted_at IS NULL
       ORDER BY event_date ASC, title ASC
       LIMIT ?`
    )
    .bind("upcoming", "completed", limit)
    .all<PublicEventItem>();

  return result.results ?? [];
}

export async function findPublicEventBySlug(c: Context<AppBindings>, slug: string) {
  const row = await getDb(c)
    .prepare(
      `SELECT ${EVENT_COLUMNS}
       FROM events
       WHERE slug = ? AND status IN (?, ?) AND deleted_at IS NULL
       LIMIT 1`
    )
    .bind(slug, "upcoming", "completed")
    .first<PublicEventItem>();

  return row ?? null;
}

export async function listPublicProjects(c: Context<AppBindings>, limit = 100) {
  const result = await getDb(c)
    .prepare(
      `SELECT ${PROJECT_LIST_COLUMNS}
       FROM projects
       WHERE status IN (?, ?) AND deleted_at IS NULL
       ORDER BY COALESCE(start_date, updated_at) DESC, title ASC
       LIMIT ?`
    )
    .bind("active", "completed", limit)
    .all<PublicProjectItem>();

  return result.results ?? [];
}

export async function findPublicProjectBySlug(
  c: Context<AppBindings>,
  slug: string
) {
  const row = await getDb(c)
    .prepare(
      `SELECT ${PROJECT_DETAIL_COLUMNS}
       FROM projects
       WHERE slug = ? AND status IN (?, ?) AND deleted_at IS NULL
       LIMIT 1`
    )
    .bind(slug, "active", "completed")
    .first<PublicProjectItem>();

  return row ?? null;
}

export async function listActiveStaff(c: Context<AppBindings>, limit = 100) {
  const result = await getDb(c)
    .prepare(
      `SELECT ${STAFF_COLUMNS}
       FROM staff
       WHERE status = ? AND deleted_at IS NULL
       ORDER BY display_order ASC, full_name ASC
       LIMIT ?`
    )
    .bind("active", limit)
    .all<PublicStaffMember>();

  return result.results ?? [];
}

export async function listActivePartners(c: Context<AppBindings>, limit = 100) {
  const result = await getDb(c)
    .prepare(
      `SELECT ${PARTNER_COLUMNS}
       FROM partners
       WHERE status = ? AND deleted_at IS NULL
       ORDER BY display_order ASC, name ASC
       LIMIT ?`
    )
    .bind("active", limit)
    .all<PublicPartner>();

  return result.results ?? [];
}

export async function listActiveMedia(c: Context<AppBindings>, limit = 100) {
  const result = await getDb(c)
    .prepare(
      `SELECT ${MEDIA_COLUMNS}
       FROM media_files
       WHERE status = ?
       ORDER BY display_order ASC, created_at DESC
       LIMIT ?`
    )
    .bind("active", limit)
    .all<PublicMediaItem>();

  return result.results ?? [];
}

export async function findActiveMediaById(c: Context<AppBindings>, id: string) {
  const row = await getDb(c)
    .prepare(
      `SELECT ${MEDIA_COLUMNS}
       FROM media_files
       WHERE id = ? AND status = ?
       LIMIT 1`
    )
    .bind(id, "active")
    .first<PublicMediaItem>();

  return row ?? null;
}
