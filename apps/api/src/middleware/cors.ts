import type { MiddlewareHandler } from "hono";
import type { AppBindings } from "../types";

export function corsPlanningMiddleware(): MiddlewareHandler<AppBindings> {
  return async (c, next) => {
    c.header("Vary", "Origin");
    await next();
  };
}
