import type { MiddlewareHandler } from "hono";
import {
  CORS_ALLOWED_HEADERS,
  CORS_ALLOWED_METHODS,
  isAllowedOrigin
} from "../config/cors";
import type { AppBindings } from "../types";

export function corsPlanningMiddleware(): MiddlewareHandler<AppBindings> {
  return async (c, next) => {
    const origin = c.req.header("Origin");

    c.header("Vary", "Origin");

    if (isAllowedOrigin(c.env, origin)) {
      c.header("Access-Control-Allow-Origin", origin);
      c.header("Access-Control-Allow-Credentials", "true");
      c.header("Access-Control-Allow-Methods", CORS_ALLOWED_METHODS);
      c.header("Access-Control-Allow-Headers", CORS_ALLOWED_HEADERS);
    }

    if (c.req.method === "OPTIONS") {
      return c.body(null, 204);
    }

    await next();
  };
}
