import type { Context } from "hono";
import { getDb, nowIso } from "./client";
import type { AppBindings } from "../types";

export type EventStatus = "draft" | "upcoming" | "completed" | "cancelled";

export type EventRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  category: string | null;
  status: EventStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type EventInput = {
  title: string;
  slug: string;
  description: string;
  eventDate: string;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  category: string | null;
  status: EventStatus;
};

const EVENT_COLUMNS =
  "id, title, slug, description, event_date, start_time, end_time, location, category, status, created_at, updated_at, deleted_at";

export async function listEvents(c: Context<AppBindings>) {
  const result = await getDb(c)
    .prepare(
      `SELECT ${EVENT_COLUMNS} FROM events WHERE deleted_at IS NULL ORDER BY event_date DESC, updated_at DESC LIMIT 100`
    )
    .all<EventRow>();

  return result.results ?? [];
}

export async function findEventById(c: Context<AppBindings>, id: string) {
  const row = await getDb(c)
    .prepare(`SELECT ${EVENT_COLUMNS} FROM events WHERE id = ? AND deleted_at IS NULL LIMIT 1`)
    .bind(id)
    .first<EventRow>();

  return row ?? null;
}

export async function findEventBySlug(c: Context<AppBindings>, slug: string) {
  const row = await getDb(c)
    .prepare("SELECT id FROM events WHERE slug = ? AND deleted_at IS NULL LIMIT 1")
    .bind(slug)
    .first<{ id: string }>();

  return row ?? null;
}

export async function createEvent(c: Context<AppBindings>, input: EventInput) {
  const id = crypto.randomUUID();
  const now = nowIso();

  await getDb(c)
    .prepare(
      `INSERT INTO events (
        id, title, slug, description, event_date, start_time, end_time,
        location, category, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      input.title,
      input.slug,
      input.description,
      input.eventDate,
      input.startTime,
      input.endTime,
      input.location,
      input.category,
      input.status,
      now,
      now
    )
    .run();

  return findEventById(c, id);
}

export async function updateEvent(
  c: Context<AppBindings>,
  id: string,
  input: EventInput
) {
  const now = nowIso();

  await getDb(c)
    .prepare(
      `UPDATE events
       SET title = ?, slug = ?, description = ?, event_date = ?, start_time = ?,
           end_time = ?, location = ?, category = ?, status = ?, updated_at = ?
       WHERE id = ? AND deleted_at IS NULL`
    )
    .bind(
      input.title,
      input.slug,
      input.description,
      input.eventDate,
      input.startTime,
      input.endTime,
      input.location,
      input.category,
      input.status,
      now,
      id
    )
    .run();

  return findEventById(c, id);
}

export async function softDeleteEvent(c: Context<AppBindings>, id: string) {
  const now = nowIso();
  const result = await getDb(c)
    .prepare("UPDATE events SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL")
    .bind(now, now, id)
    .run();

  return result.meta.changes > 0;
}
