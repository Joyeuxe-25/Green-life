import { Hono } from "hono";
import type { Context } from "hono";
import {
  createPartner,
  findPartnerById,
  findPartnerBySlug,
  listPartners,
  softDeletePartner,
  updatePartner,
  type PartnerInput,
  type PartnerStatus
} from "../db/partners";
import { requireAdmin } from "../middleware/require-admin";
import type { AppBindings } from "../types";
import { notFound, success, validationError } from "../utils/http";

const PARTNER_STATUSES: PartnerStatus[] = ["active", "hidden"];

export const adminPartnersRoutes = new Hono<AppBindings>();

adminPartnersRoutes.use("*", requireAdmin());

adminPartnersRoutes.get("/", async (c) => {
  const partners = await listPartners(c);
  return success(c, { partners });
});

adminPartnersRoutes.get("/:id", async (c) => {
  const partner = await findPartnerById(c, c.req.param("id"));
  if (!partner) {
    return notFound(c, "Partner not found");
  }

  return success(c, { partner });
});

adminPartnersRoutes.post("/", async (c) => {
  const parsed = await parsePartnerInput(c);
  if (!parsed.ok) {
    return validationError(c, parsed.message);
  }

  const slug = await ensureUniqueSlug(c, parsed.data.slug);
  const partner = await createPartner(c, {
    ...parsed.data,
    slug
  });

  return success(c, { partner }, 201);
});

adminPartnersRoutes.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await findPartnerById(c, id);
  if (!existing) {
    return notFound(c, "Partner not found");
  }

  const parsed = await parsePartnerInput(c);
  if (!parsed.ok) {
    return validationError(c, parsed.message);
  }

  const slugOwner = await findPartnerBySlug(c, parsed.data.slug);
  if (slugOwner && slugOwner.id !== id) {
    return validationError(c, "Slug is already used by another partner");
  }

  const partner = await updatePartner(c, id, parsed.data);
  return success(c, { partner });
});

adminPartnersRoutes.delete("/:id", async (c) => {
  const deleted = await softDeletePartner(c, c.req.param("id"));
  if (!deleted) {
    return notFound(c, "Partner not found");
  }

  return success(c, { deleted: true });
});

type ParsedPartnerInput =
  | {
      ok: true;
      data: PartnerInput;
    }
  | {
      ok: false;
      message: string;
    };

async function parsePartnerInput(
  c: Context<AppBindings>
): Promise<ParsedPartnerInput> {
  const body = await readJsonBody(c);
  const name = getString(body, "name").trim();
  const providedSlug = getString(body, "slug").trim();
  const status = getString(body, "status").trim() || "active";

  if (!name) {
    return { ok: false, message: "Name is required" };
  }

  if (!PARTNER_STATUSES.includes(status as PartnerStatus)) {
    return { ok: false, message: "Status must be active or hidden" };
  }

  return {
    ok: true,
    data: {
      name,
      slug: slugify(providedSlug || name),
      websiteUrl: nullableString(body, "websiteUrl"),
      description: nullableString(body, "description"),
      displayOrder: getInteger(body, "displayOrder"),
      status: status as PartnerStatus,
      isTextOnly: getBoolean(body, "isTextOnly")
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

function getBoolean(body: Record<string, unknown>, key: string) {
  const value = body[key];
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  return getString(body, key) === "true";
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || `partner-${Date.now()}`;
}

async function ensureUniqueSlug(c: Context<AppBindings>, slug: string) {
  let candidate = slug;
  for (let index = 2; index < 50; index += 1) {
    const existing = await findPartnerBySlug(c, candidate);
    if (!existing) {
      return candidate;
    }
    candidate = `${slug}-${index}`;
  }

  return `${slug}-${Date.now()}`;
}
