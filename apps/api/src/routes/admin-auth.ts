import { Hono } from "hono";
import type { Context } from "hono";
import { getAdminSessionExpiresDays } from "../config/cookies";
import {
  findActiveAdminByEmail,
  findActiveAdminById,
  safeAdmin,
  updateAdminLastLogin,
  updateAdminPasswordHash
} from "../db/admin";
import { requireAdmin } from "../middleware/require-admin";
import type { AppBindings } from "../types";
import { errorResponse, success, unauthorized, validationError } from "../utils/http";
import { hashPassword, verifyPassword } from "../utils/password";
import {
  clearAdminSessionCookie,
  createAdminSessionCookiePayload,
  getDefaultAdminCookieName,
  getSessionFromCookie,
  setAdminSessionCookie,
  signSession
} from "../utils/session";

export const adminAuthRoutes = new Hono<AppBindings>();

adminAuthRoutes.get("/", (c) =>
  success(c, {
    module: "admin-auth",
    status: "ready",
    cookieName: c.env.ADMIN_SESSION_COOKIE_NAME ?? getDefaultAdminCookieName(),
    message:
      "Backend cookie-auth routes are available. Frontend integration will be implemented in a later phase."
  })
);

adminAuthRoutes.post("/login", async (c) => {
  if (!c.env.ADMIN_SESSION_SECRET) {
    return errorResponse(c, "Admin session secret is not configured", 500);
  }

  const body = await readJsonBody(c);
  const email = getString(body, "email").trim().toLowerCase();
  const password = getString(body, "password");

  if (!email || !password) {
    return validationError(c, "Email and password are required");
  }

  const admin = await findActiveAdminByEmail(c, email);
  if (!admin) {
    return unauthorized(c, "Invalid credentials");
  }

  const passwordIsValid = await verifyPassword(password, admin.password_hash);
  if (!passwordIsValid) {
    return unauthorized(c, "Invalid credentials");
  }

  const expiresAt =
    Date.now() + getAdminSessionExpiresDays(c.env) * 24 * 60 * 60 * 1000;
  const payload = createAdminSessionCookiePayload(admin.id, admin.email, expiresAt);
  const sessionValue = await signSession(payload, c.env.ADMIN_SESSION_SECRET);

  setAdminSessionCookie(c, sessionValue);
  await updateAdminLastLogin(c, admin.id);

  return success(c, {
    admin: safeAdmin(admin)
  });
});

adminAuthRoutes.get("/me", async (c) => {
  const session = await getSessionFromCookie(c);
  if (!session) {
    return unauthorized(c);
  }

  const admin = await findActiveAdminById(c, session.adminId);
  if (!admin || admin.email !== session.email) {
    return unauthorized(c);
  }

  return success(c, {
    admin: safeAdmin(admin)
  });
});

adminAuthRoutes.post("/logout", (c) => {
  clearAdminSessionCookie(c);
  return success(c, {
    loggedOut: true
  });
});

adminAuthRoutes.post("/change-password", requireAdmin(), async (c) => {
  const admin = c.get("admin");
  if (!admin) {
    return unauthorized(c);
  }

  const body = await readJsonBody(c);
  const currentPassword = getString(body, "currentPassword");
  const newPassword = getString(body, "newPassword");
  const confirmPassword = getString(body, "confirmPassword");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return validationError(c, "Current password, new password, and confirmation are required");
  }

  if (newPassword !== confirmPassword) {
    return validationError(c, "New password and confirmation do not match");
  }

  if (!isStrongEnoughPassword(newPassword)) {
    return validationError(
      c,
      "New password must be at least 12 characters and include letters and numbers"
    );
  }

  const adminRow = await findActiveAdminById(c, admin.id);
  if (!adminRow) {
    return unauthorized(c);
  }

  const currentPasswordIsValid = await verifyPassword(
    currentPassword,
    adminRow.password_hash
  );

  if (!currentPasswordIsValid) {
    return unauthorized(c, "Current password is incorrect");
  }

  const newPasswordHash = await hashPassword(newPassword);
  await updateAdminPasswordHash(c, admin.id, newPasswordHash);
  clearAdminSessionCookie(c);

  return success(c, {
    passwordChanged: true,
    requiresLogin: true
  });
});

async function readJsonBody(c: Context<AppBindings>) {
  try {
    return (await c.req.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function getString(body: Record<string, unknown>, key: string) {
  const value = body[key];
  return typeof value === "string" ? value : "";
}

function isStrongEnoughPassword(password: string) {
  return password.length >= 12 && /[A-Za-z]/.test(password) && /\d/.test(password);
}
