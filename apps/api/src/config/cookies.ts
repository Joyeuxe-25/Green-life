import type { Env } from "../types";

export const DEFAULT_ADMIN_SESSION_COOKIE_NAME = "glr_admin_session";
export const DEFAULT_ADMIN_SESSION_EXPIRES_DAYS = 7;

export const PLANNED_ADMIN_COOKIE_SETTINGS = {
  httpOnly: true,
  secure: true,
  sameSite: "Lax",
  path: "/"
} as const;

export function getAdminSessionCookieName(env: Env) {
  return env.ADMIN_SESSION_COOKIE_NAME || DEFAULT_ADMIN_SESSION_COOKIE_NAME;
}

export function getAdminSessionExpiresDays(env: Env) {
  const configured = Number.parseInt(env.ADMIN_SESSION_EXPIRES_DAYS ?? "", 10);
  return Number.isFinite(configured) && configured > 0
    ? configured
    : DEFAULT_ADMIN_SESSION_EXPIRES_DAYS;
}
