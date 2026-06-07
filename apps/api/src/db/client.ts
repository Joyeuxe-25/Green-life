import type { Context } from "hono";
import type { AppBindings } from "../types";

export function getDb(c: Context<AppBindings>) {
  return c.env.DATABASE;
}

export function nowIso() {
  return new Date().toISOString();
}

export async function firstOrNull<T>(
  statement: D1PreparedStatement
): Promise<T | null> {
  const result = await statement.first<T>();
  return result ?? null;
}
