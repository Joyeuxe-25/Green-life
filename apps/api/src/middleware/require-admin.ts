import type { MiddlewareHandler } from "hono";
import { findActiveAdminById, safeAdmin } from "../db/admin";
import type { AppBindings } from "../types";
import { unauthorized } from "../utils/http";
import { getSessionFromCookie } from "../utils/session";

export function requireAdmin(): MiddlewareHandler<AppBindings> {
  return async (c, next) => {
    const session = await getSessionFromCookie(c);

    if (!session) {
      return unauthorized(c);
    }

    const admin = await findActiveAdminById(c, session.adminId);
    if (!admin || admin.email !== session.email) {
      return unauthorized(c);
    }

    c.set("admin", safeAdmin(admin));
    await next();
  };
}
