import { Hono } from "hono";
import type { AppBindings } from "../types";
import { placeholder } from "../utils/http";

export const adminProjectsRoutes = new Hono<AppBindings>();

adminProjectsRoutes.get("/", (c) => placeholder(c, "admin-projects"));
