import { Hono } from "hono";
import type { AppBindings } from "../types";
import { placeholder } from "../utils/http";

export const mediaRoutes = new Hono<AppBindings>();

mediaRoutes.get("/", (c) => placeholder(c, "media"));
