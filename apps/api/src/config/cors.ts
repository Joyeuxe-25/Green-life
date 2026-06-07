import type { Env } from "../types";

export function getAllowedOrigins(env: Env) {
  return (env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

// Planning note: admin authenticated requests will later need credentials
// support because auth is locked to secure HTTP-only cookies.
