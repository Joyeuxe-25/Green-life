import type { Env } from "../types";

const DEFAULT_ALLOWED_ORIGINS = [
  "https://green-life-admin-site.vercel.app",
  "https://green-life-public-site.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001"
];

export function getAllowedOrigins(env: Env) {
  const configuredOrigins = (env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return Array.from(new Set([...DEFAULT_ALLOWED_ORIGINS, ...configuredOrigins]));
}

export function isAllowedOrigin(env: Env, origin: string | undefined) {
  if (!origin) {
    return false;
  }

  return getAllowedOrigins(env).includes(origin);
}

export const CORS_ALLOWED_METHODS = "GET,POST,PUT,PATCH,DELETE,OPTIONS";
export const CORS_ALLOWED_HEADERS = "Content-Type,Authorization";
