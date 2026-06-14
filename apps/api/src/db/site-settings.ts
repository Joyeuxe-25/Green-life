import type { Context } from "hono";
import { getDb, nowIso } from "./client";
import type { AppBindings } from "../types";

export type SiteSettingRow = {
  key: string;
  group_key: string;
  label: string;
  value: string | null;
  field_type: string;
  updated_at: string;
};

export type SiteSettingInput = {
  key: string;
  groupKey: string;
  label: string;
  value: string | null;
  fieldType: string;
};

const SITE_SETTING_COLUMNS = "key, group_key, label, value, field_type, updated_at";

export async function listSiteSettings(c: Context<AppBindings>) {
  const result = await getDb(c)
    .prepare(
      `SELECT ${SITE_SETTING_COLUMNS} FROM site_settings ORDER BY group_key ASC, key ASC LIMIT 300`
    )
    .all<SiteSettingRow>();

  return result.results ?? [];
}

export async function findSiteSettingByKey(
  c: Context<AppBindings>,
  key: string
) {
  const row = await getDb(c)
    .prepare(`SELECT ${SITE_SETTING_COLUMNS} FROM site_settings WHERE key = ? LIMIT 1`)
    .bind(key)
    .first<SiteSettingRow>();

  return row ?? null;
}

export async function createSiteSetting(
  c: Context<AppBindings>,
  input: SiteSettingInput
) {
  const now = nowIso();

  await getDb(c)
    .prepare(
      `INSERT INTO site_settings (
        key, group_key, label, value, field_type, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(
      input.key,
      input.groupKey,
      input.label,
      input.value,
      input.fieldType,
      now
    )
    .run();

  return findSiteSettingByKey(c, input.key);
}

export async function updateSiteSetting(
  c: Context<AppBindings>,
  key: string,
  input: SiteSettingInput
) {
  const now = nowIso();

  await getDb(c)
    .prepare(
      `UPDATE site_settings
       SET key = ?, group_key = ?, label = ?, value = ?, field_type = ?,
           updated_at = ?
       WHERE key = ?`
    )
    .bind(
      input.key,
      input.groupKey,
      input.label,
      input.value,
      input.fieldType,
      now,
      key
    )
    .run();

  return findSiteSettingByKey(c, input.key);
}

export async function deleteSiteSetting(c: Context<AppBindings>, key: string) {
  const result = await getDb(c)
    .prepare("DELETE FROM site_settings WHERE key = ?")
    .bind(key)
    .run();

  return result.meta.changes > 0;
}
