import { Hono } from "hono";
import { corsPlanningMiddleware } from "./middleware/cors";
import { adminAuthRoutes } from "./routes/admin-auth";
import { adminContactMessagesRoutes } from "./routes/admin-contact-messages";
import { adminContentBlocksRoutes } from "./routes/admin-content-blocks";
import { adminDonationMessagesRoutes } from "./routes/admin-donation-messages";
import { adminEventsRoutes } from "./routes/admin-events";
import { adminImpactStatsRoutes } from "./routes/admin-impact-stats";
import { adminMediaRoutes } from "./routes/admin-media";
import { adminNewsRoutes } from "./routes/admin-news";
import { adminPartnersRoutes } from "./routes/admin-partners";
import { adminProgramsRoutes } from "./routes/admin-programs";
import { adminProjectsRoutes } from "./routes/admin-projects";
import { adminSetupRoutes, handleFirstAdminSetup } from "./routes/admin-setup";
import { adminSiteSettingsRoutes } from "./routes/admin-site-settings";
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
    name: "Green for Life Rwanda API",
    status: "placeholder"
  });
});

app.route("/", healthRoutes);
app.route("/public", publicRoutes);
app.post("/admin/setup", handleFirstAdminSetup);
app.route("/admin/setup", adminSetupRoutes);
app.route("/admin/auth", adminAuthRoutes);
app.route("/admin/news", adminNewsRoutes);
app.route("/admin/events", adminEventsRoutes);
app.route("/admin/projects", adminProjectsRoutes);
app.route("/admin/staff", adminStaffRoutes);
app.route("/admin/partners", adminPartnersRoutes);
app.route("/admin/contact-messages", adminContactMessagesRoutes);
app.route("/admin/donation-messages", adminDonationMessagesRoutes);
app.route("/admin/content-blocks", adminContentBlocksRoutes);
app.route("/admin/impact-stats", adminImpactStatsRoutes);
app.route("/admin/programs", adminProgramsRoutes);
app.route("/admin/site-settings", adminSiteSettingsRoutes);
app.route("/admin/media", adminMediaRoutes);
app.route("/contact", contactRoutes);
app.route("/donations", donationRoutes);
app.route("/media", mediaRoutes);

export default app;
