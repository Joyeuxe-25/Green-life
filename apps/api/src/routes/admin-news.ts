import { Hono } from "hono";
import type { Context } from "hono";
import {
  createNews,
  findNewsById,
  findNewsBySlug,
  listNews,
  softDeleteNews,
  updateNews,
  type NewsInput,
  type NewsStatus
} from "../db/news";
import { requireAdmin } from "../middleware/require-admin";
import type { AppBindings } from "../types";
import { errorResponse, notFound, success, validationError } from "../utils/http";

const NEWS_STATUSES: NewsStatus[] = ["draft", "published", "archived"];

export const adminNewsRoutes = new Hono<AppBindings>();

adminNewsRoutes.use("*", requireAdmin());

adminNewsRoutes.get("/", async (c) => {
  const news = await listNews(c);
  return success(c, { news });
});

adminNewsRoutes.get("/:id", async (c) => {
  const newsItem = await findNewsById(c, c.req.param("id"));
  if (!newsItem) {
    return notFound(c, "News item not found");
  }

  return success(c, { news: newsItem });
});

adminNewsRoutes.post("/", async (c) => {
  const parsed = await parseNewsInput(c);
  if (!parsed.ok) {
    return validationError(c, parsed.message);
  }

  const slug = await ensureUniqueSlug(c, parsed.data.slug);
  const newsItem = await createNews(c, {
    ...parsed.data,
    slug
  });

  return success(c, { news: newsItem }, 201);
});

adminNewsRoutes.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await findNewsById(c, id);
  if (!existing) {
    return notFound(c, "News item not found");
  }

  const parsed = await parseNewsInput(c);
  if (!parsed.ok) {
    return validationError(c, parsed.message);
  }

  const slugOwner = await findNewsBySlug(c, parsed.data.slug);
  if (slugOwner && slugOwner.id !== id) {
    return validationError(c, "Slug is already used by another news item");
  }

  const newsItem = await updateNews(c, id, parsed.data);
  return success(c, { news: newsItem });
});

adminNewsRoutes.delete("/:id", async (c) => {
  const deleted = await softDeleteNews(c, c.req.param("id"));
  if (!deleted) {
    return notFound(c, "News item not found");
  }

  return success(c, { deleted: true });
});

type ParsedNewsInput =
  | {
      ok: true;
      data: NewsInput;
    }
  | {
      ok: false;
      message: string;
    };

async function parseNewsInput(c: Context<AppBindings>): Promise<ParsedNewsInput> {
  const body = await readJsonBody(c);
  const title = getString(body, "title").trim();
  const content = getString(body, "content").trim();
  const excerpt = getString(body, "excerpt").trim();
  const providedSlug = getString(body, "slug").trim();
  const status = getString(body, "status").trim() || "draft";
  const publishedAt = nullableString(body, "publishedAt");

  if (!title) {
    return { ok: false, message: "Title is required" };
  }

  if (!excerpt) {
    return { ok: false, message: "Excerpt is required" };
  }

  if (!content) {
    return { ok: false, message: "Content is required" };
  }

  if (!NEWS_STATUSES.includes(status as NewsStatus)) {
    return { ok: false, message: "Status must be draft, published, or archived" };
  }

  return {
    ok: true,
    data: {
      title,
      slug: slugify(providedSlug || title),
      excerpt,
      content,
      category: nullableString(body, "category"),
      publishedAt,
      status: status as NewsStatus,
      seoTitle: nullableString(body, "seoTitle"),
      seoDescription: nullableString(body, "seoDescription")
    }
  };
}

async function readJsonBody(c: Context<AppBindings>) {
  try {
    return (await c.req.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function getString(body: Record<string, unknown>, key: string) {
  const value = body[key];
  return typeof value === "string" ? value : "";
}

function nullableString(body: Record<string, unknown>, key: string) {
  const value = getString(body, key).trim();
  return value ? value : null;
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || `news-${Date.now()}`;
}

async function ensureUniqueSlug(c: Context<AppBindings>, slug: string) {
  let candidate = slug;
  for (let index = 2; index < 50; index += 1) {
    const existing = await findNewsBySlug(c, candidate);
    if (!existing) {
      return candidate;
    }
    candidate = `${slug}-${index}`;
  }

  throw errorResponse(c, "Could not generate a unique slug", 500);
}
