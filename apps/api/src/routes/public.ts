import { Hono } from "hono";
import type { AppBindings } from "../types";
import { placeholder } from "../utils/http";

export const publicRoutes = new Hono<AppBindings>();

publicRoutes.get("/", (c) => placeholder(c, "public"));
