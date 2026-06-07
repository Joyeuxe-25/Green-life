import { Hono } from "hono";
import { DEFAULT_ADMIN_SESSION_COOKIE_NAME } from "../config/cookies";
import type { AppBindings } from "../types";
import { success } from "../utils/http";

export const adminAuthRoutes = new Hono<AppBindings>();

adminAuthRoutes.get("/", (c) =>
  success(c, {
    module: "admin-auth",
    status: "placeholder",
    cookieName: c.env.ADMIN_SESSION_COOKIE_NAME ?? DEFAULT_ADMIN_SESSION_COOKIE_NAME,
    message:
      "Cookie-based admin auth will be implemented in a later phase. No login/logout/session logic exists yet."
  })
);
