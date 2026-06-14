import type { Context } from "hono";
import { getDb, nowIso } from "./client";
import type { AppBindings } from "../types";

export type MessageStatus = "new" | "read" | "replied" | "archived";

export type ContactMessageRow = {
  id: string;
  sender_name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: MessageStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type DonationMessageRow = {
  id: string;
  donor_name: string;
  email: string;
  phone: string | null;
  intended_amount: string | null;
  message: string | null;
  status: MessageStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

const CONTACT_MESSAGE_COLUMNS =
  "id, sender_name, email, phone, subject, message, status, created_at, updated_at, deleted_at";
const DONATION_MESSAGE_COLUMNS =
  "id, donor_name, email, phone, intended_amount, message, status, created_at, updated_at, deleted_at";

export async function listContactMessages(c: Context<AppBindings>) {
  const result = await getDb(c)
    .prepare(
      `SELECT ${CONTACT_MESSAGE_COLUMNS} FROM contact_messages WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 200`
    )
    .all<ContactMessageRow>();

  return result.results ?? [];
}

export async function findContactMessageById(c: Context<AppBindings>, id: string) {
  const row = await getDb(c)
    .prepare(
      `SELECT ${CONTACT_MESSAGE_COLUMNS} FROM contact_messages WHERE id = ? AND deleted_at IS NULL LIMIT 1`
    )
    .bind(id)
    .first<ContactMessageRow>();

  return row ?? null;
}

export async function softDeleteContactMessage(c: Context<AppBindings>, id: string) {
  const now = nowIso();
  const result = await getDb(c)
    .prepare("UPDATE contact_messages SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL")
    .bind(now, now, id)
    .run();

  return result.meta.changes > 0;
}

export async function updateContactMessageStatus(
  c: Context<AppBindings>,
  id: string,
  status: MessageStatus
) {
  const now = nowIso();
  const result = await getDb(c)
    .prepare(
      "UPDATE contact_messages SET status = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL"
    )
    .bind(status, now, id)
    .run();

  if (result.meta.changes === 0) {
    return null;
  }

  return findContactMessageById(c, id);
}

export async function listDonationMessages(c: Context<AppBindings>) {
  const result = await getDb(c)
    .prepare(
      `SELECT ${DONATION_MESSAGE_COLUMNS} FROM donation_messages WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 200`
    )
    .all<DonationMessageRow>();

  return result.results ?? [];
}

export async function findDonationMessageById(c: Context<AppBindings>, id: string) {
  const row = await getDb(c)
    .prepare(
      `SELECT ${DONATION_MESSAGE_COLUMNS} FROM donation_messages WHERE id = ? AND deleted_at IS NULL LIMIT 1`
    )
    .bind(id)
    .first<DonationMessageRow>();

  return row ?? null;
}

export async function softDeleteDonationMessage(c: Context<AppBindings>, id: string) {
  const now = nowIso();
  const result = await getDb(c)
    .prepare("UPDATE donation_messages SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL")
    .bind(now, now, id)
    .run();

  return result.meta.changes > 0;
}

export async function updateDonationMessageStatus(
  c: Context<AppBindings>,
  id: string,
  status: MessageStatus
) {
  const now = nowIso();
  const result = await getDb(c)
    .prepare(
      "UPDATE donation_messages SET status = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL"
    )
    .bind(status, now, id)
    .run();

  if (result.meta.changes === 0) {
    return null;
  }

  return findDonationMessageById(c, id);
}
