export const DEFAULT_ADMIN_SESSION_COOKIE_NAME = "glr_admin_session";

export const PLANNED_ADMIN_COOKIE_SETTINGS = {
  httpOnly: true,
  secure: true,
  sameSite: "Lax",
  path: "/"
} as const;

// Planning only: actual session creation, signing, validation, and clearing
// will be implemented in a later authentication phase.
