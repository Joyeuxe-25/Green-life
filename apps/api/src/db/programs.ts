import type { Context } from "hono";
import { getDb, nowIso } from "./client";
import type { AppBindings } from "../types";
import type { PublishStatus } from "./content-blocks";

export type ProgramRow = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  body: string | null;
  icon_name: string | null;
  display_order: number;
  status: PublishStatus;
  created_at: string;
  updated_at: string;
};

export type ProgramInput = {
  title: string;
  slug: string;
  summary: string | null;
  body: string | null;
  iconName: string | null;
  displayOrder: number;
  status: PublishStatus;
};

const PROGRAM_COLUMNS =
  "id, title, slug, summary, body, icon_name, display_order, status, created_at, updated_at";

export async function listPrograms(c: Context<AppBindings>) {
  const result = await getDb(c)
    .prepare(
      `SELECT ${PROGRAM_COLUMNS} FROM programs ORDER BY display_order ASC, title ASC LIMIT 200`
    )
    .all<ProgramRow>();

  return result.results ?? [];
}

export async function findProgramById(c: Context<AppBindings>, id: string) {
  const row = await getDb(c)
    .prepare(`SELECT ${PROGRAM_COLUMNS} FROM programs WHERE id = ? LIMIT 1`)
    .bind(id)
    .first<ProgramRow>();

  return row ?? null;
}

export async function findProgramBySlug(c: Context<AppBindings>, slug: string) {
  const row = await getDb(c)
    .prepare("SELECT id FROM programs WHERE slug = ? LIMIT 1")
    .bind(slug)
    .first<{ id: string }>();

  return row ?? null;
}

export async function createProgram(c: Context<AppBindings>, input: ProgramInput) {
  const id = crypto.randomUUID();
  const now = nowIso();

  await getDb(c)
    .prepare(
      `INSERT INTO programs (
        id, title, slug, summary, body, icon_name, display_order, status,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      input.title,
      input.slug,
      input.summary,
      input.body,
      input.iconName,
      input.displayOrder,
      input.status,
      now,
      now
    )
    .run();

  return findProgramById(c, id);
}

export async function updateProgram(
  c: Context<AppBindings>,
  id: string,
  input: ProgramInput
) {
  const now = nowIso();

  await getDb(c)
    .prepare(
      `UPDATE programs
       SET title = ?, slug = ?, summary = ?, body = ?, icon_name = ?,
           display_order = ?, status = ?, updated_at = ?
       WHERE id = ?`
    )
    .bind(
      input.title,
      input.slug,
      input.summary,
      input.body,
      input.iconName,
      input.displayOrder,
      input.status,
      now,
      id
    )
    .run();

  return findProgramById(c, id);
}

export async function deleteProgram(c: Context<AppBindings>, id: string) {
  const result = await getDb(c)
    .prepare("DELETE FROM programs WHERE id = ?")
    .bind(id)
    .run();

  return result.meta.changes > 0;
}
