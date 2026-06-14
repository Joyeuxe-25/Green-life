import { Hono } from "hono";
import type { Context } from "hono";
import {
  findActiveMediaById,
  findPublicEventBySlug,
  findPublicProjectBySlug,
  findPublishedNewsBySlug,
  listActiveMedia,
  listActivePartners,
  listActiveStaff,
  listPublicEvents,
  listPublicProjects,
  listPublicSiteSettings,
  listPublishedContentBlocks,
  listPublishedImpactStats,
  listPublishedNews,
  listPublishedPrograms,
  type PublicPageKey
} from "../db/public";
import type { AppBindings } from "../types";
import { notFound, success } from "../utils/http";

const pageKeys = [
  "home",
  "about",
  "programs",
  "impact",
  "contact",
  "donate",
  "get-involved"
] as const;

export const publicRoutes = new Hono<AppBindings>();

publicRoutes.get("/", (c) =>
  success(c, {
    routes: [
      "/public/home",
      "/public/about",
      "/public/programs",
      "/public/impact",
      "/public/contact",
      "/public/donate",
      "/public/get-involved",
      "/public/site-settings",
      "/public/news",
      "/public/events",
      "/public/projects",
      "/public/staff",
      "/public/partners",
      "/public/media"
    ]
  })
);

publicRoutes.get("/home", async (c) => {
  const [
    blocks,
    impactStats,
    programs,
    projects,
    news,
    events,
    partners,
    siteSettings
  ] = await Promise.all([
    listPublishedContentBlocks(c, "home"),
    listPublishedImpactStats(c, 8),
    listPublishedPrograms(c, 6),
    listPublicProjects(c, 6),
    listPublishedNews(c, 6),
    listPublicEvents(c, 6),
    listActivePartners(c, 8),
    listPublicSiteSettings(c)
  ]);

  return success(c, {
    page: "home",
    blocks,
    impactStats,
    programs,
    projects,
    news,
    events,
    partners,
    siteSettings
  });
});

publicRoutes.get("/about", (c) => pageResponse(c, "about", true));

publicRoutes.get("/programs", async (c) => {
  const [blocks, programs] = await Promise.all([
    listPublishedContentBlocks(c, "programs"),
    listPublishedPrograms(c)
  ]);

  return success(c, { page: "programs", blocks, programs });
});

publicRoutes.get("/impact", async (c) => {
  const [blocks, impactStats] = await Promise.all([
    listPublishedContentBlocks(c, "impact"),
    listPublishedImpactStats(c)
  ]);

  return success(c, { page: "impact", blocks, impactStats });
});

publicRoutes.get("/contact", (c) => pageResponse(c, "contact", true));
publicRoutes.get("/donate", (c) => pageResponse(c, "donate", true));
publicRoutes.get("/get-involved", (c) =>
  pageResponse(c, "get-involved", true)
);

publicRoutes.get("/site-settings", async (c) => {
  const siteSettings = await listPublicSiteSettings(c);
  return success(c, { siteSettings });
});

publicRoutes.get("/news", async (c) => {
  const news = await listPublishedNews(c);
  return success(c, { news });
});

publicRoutes.get("/news/:slug", async (c) => {
  const news = await findPublishedNewsBySlug(c, c.req.param("slug"));
  if (!news) {
    return notFound(c, "News item not found");
  }

  return success(c, { news });
});

publicRoutes.get("/events", async (c) => {
  const events = await listPublicEvents(c);
  return success(c, { events });
});

publicRoutes.get("/events/:slug", async (c) => {
  const event = await findPublicEventBySlug(c, c.req.param("slug"));
  if (!event) {
    return notFound(c, "Event not found");
  }

  return success(c, { event });
});

publicRoutes.get("/projects", async (c) => {
  const projects = await listPublicProjects(c);
  return success(c, { projects });
});

publicRoutes.get("/projects/:slug", async (c) => {
  const project = await findPublicProjectBySlug(c, c.req.param("slug"));
  if (!project) {
    return notFound(c, "Project not found");
  }

  return success(c, { project });
});

publicRoutes.get("/staff", async (c) => {
  const staff = await listActiveStaff(c);
  return success(c, { staff });
});

publicRoutes.get("/partners", async (c) => {
  const partners = await listActivePartners(c);
  return success(c, { partners });
});

publicRoutes.get("/media", async (c) => {
  const media = await listActiveMedia(c);
  return success(c, { media });
});

publicRoutes.get("/media/:id", async (c) => {
  const media = await findActiveMediaById(c, c.req.param("id"));
  if (!media) {
    return notFound(c, "Media file not found");
  }

  return success(c, { media });
});

async function pageResponse(
  c: Context<AppBindings>,
  page: PublicPageKey,
  includeSettings = false
) {
  if (!pageKeys.includes(page)) {
    return notFound(c, "Page not found");
  }

  const [blocks, siteSettings] = await Promise.all([
    listPublishedContentBlocks(c, page),
    includeSettings ? listPublicSiteSettings(c) : Promise.resolve([])
  ]);

  return success(c, {
    page,
    blocks,
    ...(includeSettings ? { siteSettings } : {})
  });
}
