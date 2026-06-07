import type { Env } from "../types";

export function getAllowedOrigins(env: Env) {
  return (env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function isAllowedOrigin(env: Env, origin: string | undefined) {
  if (!origin) {
    return false;
  }

  return getAllowedOrigins(env).includes(origin);
}

export const CORS_ALLOWED_METHODS = "GET,POST,PUT,PATCH,DELETE,OPTIONS";
export const CORS_ALLOWED_HEADERS = "Content-Type,Authorization";
