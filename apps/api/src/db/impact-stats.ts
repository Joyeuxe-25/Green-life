import type { Context } from "hono";
import { getDb, nowIso } from "./client";
import type { AppBindings } from "../types";
import type { PublishStatus } from "./content-blocks";

export type ImpactStatRow = {
  id: string;
  label: string;
  value: string;
  suffix: string | null;
  description: string | null;
  display_order: number;
  status: PublishStatus;
  created_at: string;
  updated_at: string;
};

export type ImpactStatInput = {
  label: string;
  value: string;
  suffix: string | null;
  description: string | null;
  displayOrder: number;
  status: PublishStatus;
};

const IMPACT_STAT_COLUMNS =
  "id, label, value, suffix, description, display_order, status, created_at, updated_at";

export async function listImpactStats(c: Context<AppBindings>) {
  const result = await getDb(c)
    .prepare(
      `SELECT ${IMPACT_STAT_COLUMNS} FROM impact_stats ORDER BY display_order ASC, label ASC LIMIT 200`
    )
    .all<ImpactStatRow>();

  return result.results ?? [];
}

export async function findImpactStatById(c: Context<AppBindings>, id: string) {
  const row = await getDb(c)
    .prepare(`SELECT ${IMPACT_STAT_COLUMNS} FROM impact_stats WHERE id = ? LIMIT 1`)
    .bind(id)
    .first<ImpactStatRow>();

  return row ?? null;
}

export async function createImpactStat(
  c: Context<AppBindings>,
  input: ImpactStatInput
) {
  const id = crypto.randomUUID();
  const now = nowIso();

  await getDb(c)
    .prepare(
      `INSERT INTO impact_stats (
        id, label, value, suffix, description, display_order, status,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      input.label,
      input.value,
      input.suffix,
      input.description,
      input.displayOrder,
      input.status,
      now,
      now
    )
    .run();

  return findImpactStatById(c, id);
}

export async function updateImpactStat(
  c: Context<AppBindings>,
  id: string,
  input: ImpactStatInput
) {
  const now = nowIso();

  await getDb(c)
    .prepare(
      `UPDATE impact_stats
       SET label = ?, value = ?, suffix = ?, description = ?, display_order = ?,
           status = ?, updated_at = ?
       WHERE id = ?`
    )
    .bind(
      input.label,
      input.value,
      input.suffix,
      input.description,
      input.displayOrder,
      input.status,
      now,
      id
    )
    .run();

  return findImpactStatById(c, id);
}

export async function deleteImpactStat(c: Context<AppBindings>, id: string) {
  const result = await getDb(c)
    .prepare("DELETE FROM impact_stats WHERE id = ?")
    .bind(id)
    .run();

  return result.meta.changes > 0;
}
