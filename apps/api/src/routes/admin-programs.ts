import { Hono } from "hono";
import type { Context } from "hono";
import type { PublishStatus } from "../db/content-blocks";
import {
  createProgram,
  deleteProgram,
  findProgramById,
  findProgramBySlug,
  listPrograms,
  updateProgram,
  type ProgramInput
} from "../db/programs";
import { requireAdmin } from "../middleware/require-admin";
import type { AppBindings } from "../types";
import { notFound, success, validationError } from "../utils/http";

const STATUSES: PublishStatus[] = ["draft", "published"];

export const adminProgramsRoutes = new Hono<AppBindings>();

adminProgramsRoutes.use("*", requireAdmin());

adminProgramsRoutes.get("/", async (c) => {
  const programs = await listPrograms(c);
  return success(c, { programs });
});

adminProgramsRoutes.get("/:id", async (c) => {
  const program = await findProgramById(c, c.req.param("id"));
  if (!program) {
    return notFound(c, "Program not found");
  }

  return success(c, { program });
});

adminProgramsRoutes.post("/", async (c) => {
  const parsed = await parseProgramInput(c);
  if (!parsed.ok) {
    return validationError(c, parsed.message);
  }

  const slug = await ensureUniqueSlug(c, parsed.data.slug);
  const program = await createProgram(c, { ...parsed.data, slug });
  return success(c, { program }, 201);
});

adminProgramsRoutes.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await findProgramById(c, id);
  if (!existing) {
    return notFound(c, "Program not found");
  }

  const parsed = await parseProgramInput(c);
  if (!parsed.ok) {
    return validationError(c, parsed.message);
  }

  const slugOwner = await findProgramBySlug(c, parsed.data.slug);
  if (slugOwner && slugOwner.id !== id) {
    return validationError(c, "Slug is already used by another program");
  }

  const program = await updateProgram(c, id, parsed.data);
  return success(c, { program });
});

adminProgramsRoutes.delete("/:id", async (c) => {
  const deleted = await deleteProgram(c, c.req.param("id"));
  if (!deleted) {
    return notFound(c, "Program not found");
  }

  return success(c, { deleted: true });
});

type ParsedProgramInput =
  | { ok: true; data: ProgramInput }
  | { ok: false; message: string };

async function parseProgramInput(
  c: Context<AppBindings>
): Promise<ParsedProgramInput> {
  const body = await readJsonBody(c);
  const title = getString(body, "title").trim();
  const providedSlug = getString(body, "slug").trim();
  const status = getString(body, "status").trim() || "draft";

  if (!title) {
    return { ok: false, message: "Title is required" };
  }

  if (!STATUSES.includes(status as PublishStatus)) {
    return { ok: false, message: "Status must be draft or published" };
  }

  return {
    ok: true,
    data: {
      title,
      slug: slugify(providedSlug || title),
      summary: nullableString(body, "summary"),
      body: nullableString(body, "body"),
      iconName: nullableString(body, "iconName"),
      displayOrder: getInteger(body, "displayOrder"),
      status: status as PublishStatus
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

function getInteger(body: Record<string, unknown>, key: string) {
  const value = body[key];
  const parsed =
    typeof value === "number" ? value : Number.parseInt(getString(body, key), 10);

  return Number.isFinite(parsed) ? Math.trunc(parsed) : 0;
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || `program-${Date.now()}`;
}

async function ensureUniqueSlug(c: Context<AppBindings>, slug: string) {
  let candidate = slug;
  for (let index = 2; index < 50; index += 1) {
    const existing = await findProgramBySlug(c, candidate);
    if (!existing) {
      return candidate;
    }
    candidate = `${slug}-${index}`;
  }

  return `${slug}-${Date.now()}`;
}
