import { Hono } from "hono";
import type { AppBindings } from "../types";
import { placeholder } from "../utils/http";

export const adminNewsRoutes = new Hono<AppBindings>();

adminNewsRoutes.get("/", (c) => placeholder(c, "admin-news"));
