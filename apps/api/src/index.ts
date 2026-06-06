import { Hono } from "hono";
import type { Env } from "./types";

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => {
  return c.json({
    name: "Green Life Rwanda API",
    status: "placeholder"
  });
});

app.get("/health", (c) => {
  return c.json({
    ok: true
  });
});

export default app;
