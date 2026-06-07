import { Hono } from "hono";
import type { AppBindings } from "../types";
import { placeholder } from "../utils/http";

export const donationRoutes = new Hono<AppBindings>();

donationRoutes.get("/", (c) => placeholder(c, "donations"));
