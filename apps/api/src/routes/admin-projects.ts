import { Hono } from "hono";
import type { Context } from "hono";
import {
  createProject,
  findProjectById,
  findProjectBySlug,
  listProjects,
  softDeleteProject,
  updateProject,
  type ProjectInput,
  type ProjectStatus
} from "../db/projects";
import { requireAdmin } from "../middleware/require-admin";
import type { AppBindings } from "../types";
import { notFound, success, validationError } from "../utils/http";

const PROJECT_STATUSES: ProjectStatus[] = ["planned", "active", "completed"];

export const adminProjectsRoutes = new Hono<AppBindings>();

adminProjectsRoutes.use("*", requireAdmin());

adminProjectsRoutes.get("/", async (c) => {
  const projects = await listProjects(c);
  return success(c, { projects });
});

adminProjectsRoutes.get("/:id", async (c) => {
  const project = await findProjectById(c, c.req.param("id"));
  if (!project) {
    return notFound(c, "Project not found");
  }

  return success(c, { project });
});

adminProjectsRoutes.post("/", async (c) => {
  const parsed = await parseProjectInput(c);
  if (!parsed.ok) {
    return validationError(c, parsed.message);
  }

  const slug = await ensureUniqueSlug(c, parsed.data.slug);
  const project = await createProject(c, {
    ...parsed.data,
    slug
  });

  return success(c, { project }, 201);
});

adminProjectsRoutes.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await findProjectById(c, id);
  if (!existing) {
    return notFound(c, "Project not found");
  }

  const parsed = await parseProjectInput(c);
  if (!parsed.ok) {
    return validationError(c, parsed.message);
  }

  const slugOwner = await findProjectBySlug(c, parsed.data.slug);
  if (slugOwner && slugOwner.id !== id) {
    return validationError(c, "Slug is already used by another project");
  }

  const project = await updateProject(c, id, parsed.data);
  return success(c, { project });
});

adminProjectsRoutes.delete("/:id", async (c) => {
  const deleted = await softDeleteProject(c, c.req.param("id"));
  if (!deleted) {
    return notFound(c, "Project not found");
  }

  return success(c, { deleted: true });
});

type ParsedProjectInput =
  | {
      ok: true;
      data: ProjectInput;
    }
  | {
      ok: false;
      message: string;
    };

async function parseProjectInput(
  c: Context<AppBindings>
): Promise<ParsedProjectInput> {
  const body = await readJsonBody(c);
  const title = getString(body, "title").trim();
  const summary = getString(body, "summary").trim();
  const description = getString(body, "description").trim();
  const providedSlug = getString(body, "slug").trim();
  const status = getString(body, "status").trim() || "planned";
  const startDate = nullableDate(body, "startDate");
  const endDate = nullableDate(body, "endDate");

  if (!title) {
    return { ok: false, message: "Title is required" };
  }

  if (!summary) {
    return { ok: false, message: "Summary is required" };
  }

  if (!description) {
    return { ok: false, message: "Description is required" };
  }

  if (!PROJECT_STATUSES.includes(status as ProjectStatus)) {
    return { ok: false, message: "Status must be planned, active, or completed" };
  }

  if (startDate && endDate && new Date(endDate).getTime() < new Date(startDate).getTime()) {
    return { ok: false, message: "End date cannot be before start date" };
  }

  return {
    ok: true,
    data: {
      title,
      slug: slugify(providedSlug || title),
      summary,
      description,
      district: nullableString(body, "district"),
      sector: nullableString(body, "sector"),
      startDate,
      endDate,
      status: status as ProjectStatus,
      category: nullableString(body, "category"),
      impactSummary: nullableString(body, "impactSummary")
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

function nullableDate(body: Record<string, unknown>, key: string) {
  const value = getString(body, key).trim();
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || `project-${Date.now()}`;
}

async function ensureUniqueSlug(c: Context<AppBindings>, slug: string) {
  let candidate = slug;
  for (let index = 2; index < 50; index += 1) {
    const existing = await findProjectBySlug(c, candidate);
    if (!existing) {
      return candidate;
    }
    candidate = `${slug}-${index}`;
  }

  return `${slug}-${Date.now()}`;
}
