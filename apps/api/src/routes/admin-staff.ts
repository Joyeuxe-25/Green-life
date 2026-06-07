import { Hono } from "hono";
import type { AppBindings } from "../types";
import { placeholder } from "../utils/http";

export const adminStaffRoutes = new Hono<AppBindings>();

adminStaffRoutes.get("/", (c) => placeholder(c, "admin-staff"));
