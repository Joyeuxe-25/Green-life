import type { Context } from "hono";
import { getDb, nowIso } from "./client";
import type { AppBindings } from "../types";

export type ProjectStatus = "planned" | "active" | "completed";

export type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  district: string | null;
  sector: string | null;
  start_date: string | null;
  end_date: string | null;
  status: ProjectStatus;
  category: string | null;
  impact_summary: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type ProjectInput = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  district: string | null;
  sector: string | null;
  startDate: string | null;
  endDate: string | null;
  status: ProjectStatus;
  category: string | null;
  impactSummary: string | null;
};

const PROJECT_COLUMNS =
  "id, title, slug, summary, description, district, sector, start_date, end_date, status, category, impact_summary, created_at, updated_at, deleted_at";

export async function listProjects(c: Context<AppBindings>) {
  const result = await getDb(c)
    .prepare(
      `SELECT ${PROJECT_COLUMNS} FROM projects WHERE deleted_at IS NULL ORDER BY updated_at DESC, created_at DESC LIMIT 100`
    )
    .all<ProjectRow>();

  return result.results ?? [];
}

export async function findProjectById(c: Context<AppBindings>, id: string) {
  const row = await getDb(c)
    .prepare(`SELECT ${PROJECT_COLUMNS} FROM projects WHERE id = ? AND deleted_at IS NULL LIMIT 1`)
    .bind(id)
    .first<ProjectRow>();

  return row ?? null;
}

export async function findProjectBySlug(c: Context<AppBindings>, slug: string) {
  const row = await getDb(c)
    .prepare("SELECT id FROM projects WHERE slug = ? AND deleted_at IS NULL LIMIT 1")
    .bind(slug)
    .first<{ id: string }>();

  return row ?? null;
}

export async function createProject(c: Context<AppBindings>, input: ProjectInput) {
  const id = crypto.randomUUID();
  const now = nowIso();

  await getDb(c)
    .prepare(
      `INSERT INTO projects (
        id, title, slug, summary, description, district, sector, start_date,
        end_date, status, category, impact_summary, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      input.title,
      input.slug,
      input.summary,
      input.description,
      input.district,
      input.sector,
      input.startDate,
      input.endDate,
      input.status,
      input.category,
      input.impactSummary,
      now,
      now
    )
    .run();

  return findProjectById(c, id);
}

export async function updateProject(
  c: Context<AppBindings>,
  id: string,
  input: ProjectInput
) {
  const now = nowIso();

  await getDb(c)
    .prepare(
      `UPDATE projects
       SET title = ?, slug = ?, summary = ?, description = ?, district = ?,
           sector = ?, start_date = ?, end_date = ?, status = ?, category = ?,
           impact_summary = ?, updated_at = ?
       WHERE id = ? AND deleted_at IS NULL`
    )
    .bind(
      input.title,
      input.slug,
      input.summary,
      input.description,
      input.district,
      input.sector,
      input.startDate,
      input.endDate,
      input.status,
      input.category,
      input.impactSummary,
      now,
      id
    )
    .run();

  return findProjectById(c, id);
}

export async function softDeleteProject(c: Context<AppBindings>, id: string) {
  const now = nowIso();
  const result = await getDb(c)
    .prepare("UPDATE projects SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL")
    .bind(now, now, id)
    .run();

  return result.meta.changes > 0;
}
