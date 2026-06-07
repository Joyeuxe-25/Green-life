import { Hono } from "hono";
import { corsPlanningMiddleware } from "./middleware/cors";
import { adminAuthRoutes } from "./routes/admin-auth";
import { adminEventsRoutes } from "./routes/admin-events";
import { adminNewsRoutes } from "./routes/admin-news";
import { adminPartnersRoutes } from "./routes/admin-partners";
import { adminProjectsRoutes } from "./routes/admin-projects";
import { adminStaffRoutes } from "./routes/admin-staff";
import { contactRoutes } from "./routes/contact";
import { donationRoutes } from "./routes/donations";
import { healthRoutes } from "./routes/health";
import { mediaRoutes } from "./routes/media";
import { publicRoutes } from "./routes/public";
import type { AppBindings } from "./types";

const app = new Hono<AppBindings>();

app.use("*", corsPlanningMiddleware());

app.get("/", (c) => {
  return c.json({
    name: "Green Life Rwanda API",
    status: "placeholder"
  });
});

app.route("/", healthRoutes);
app.route("/public", publicRoutes);
app.route("/admin/auth", adminAuthRoutes);
app.route("/admin/news", adminNewsRoutes);
app.route("/admin/events", adminEventsRoutes);
app.route("/admin/projects", adminProjectsRoutes);
app.route("/admin/staff", adminStaffRoutes);
app.route("/admin/partners", adminPartnersRoutes);
app.route("/contact", contactRoutes);
app.route("/donations", donationRoutes);
app.route("/media", mediaRoutes);

export default app;
