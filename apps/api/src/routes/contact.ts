import { Hono } from "hono";
import type { AppBindings } from "../types";
import { placeholder } from "../utils/http";

export const contactRoutes = new Hono<AppBindings>();

contactRoutes.get("/", (c) => placeholder(c, "contact"));
