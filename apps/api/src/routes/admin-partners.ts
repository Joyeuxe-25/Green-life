import { Hono } from "hono";
import type { AppBindings } from "../types";
import { placeholder } from "../utils/http";

export const adminPartnersRoutes = new Hono<AppBindings>();

adminPartnersRoutes.get("/", (c) => placeholder(c, "admin-partners"));
