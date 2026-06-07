import { Hono } from "hono";
import type { AppBindings } from "../types";
import { placeholder } from "../utils/http";

export const adminEventsRoutes = new Hono<AppBindings>();

adminEventsRoutes.get("/", (c) => placeholder(c, "admin-events"));
