import { Hono } from "hono";
import type { Context } from "hono";
import {
  createContentBlock,
  deleteContentBlock,
  findContentBlockById,
  listContentBlocks,
  updateContentBlock,
  type ContentBlockInput,
  type PublishStatus
} from "../db/content-blocks";
import { requireAdmin } from "../middleware/require-admin";
import type { AppBindings } from "../types";
import { notFound, success, validationError } from "../utils/http";

const STATUSES: PublishStatus[] = ["draft", "published"];

export const adminContentBlocksRoutes = new Hono<AppBindings>();

adminContentBlocksRoutes.use("*", requireAdmin());

adminContentBlocksRoutes.get("/", async (c) => {
  const blocks = await listContentBlocks(c);
  return success(c, { blocks });
});

adminContentBlocksRoutes.get("/:id", async (c) => {
  const block = await findContentBlockById(c, c.req.param("id"));
  if (!block) {
    return notFound(c, "Content block not found");
  }

  return success(c, { block });
});

adminContentBlocksRoutes.post("/", async (c) => {
  const parsed = await parseContentBlockInput(c);
  if (!parsed.ok) {
    return validationError(c, parsed.message);
  }

  const block = await createContentBlock(c, parsed.data);
  return success(c, { block }, 201);
});

adminContentBlocksRoutes.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await findContentBlockById(c, id);
  if (!existing) {
    return notFound(c, "Content block not found");
  }

  const parsed = await parseContentBlockInput(c);
  if (!parsed.ok) {
    return validationError(c, parsed.message);
  }

  const block = await updateContentBlock(c, id, parsed.data);
  return success(c, { block });
});

adminContentBlocksRoutes.delete("/:id", async (c) => {
  const deleted = await deleteContentBlock(c, c.req.param("id"));
  if (!deleted) {
    return notFound(c, "Content block not found");
  }

  return success(c, { deleted: true });
});

type ParsedContentBlockInput =
  | { ok: true; data: ContentBlockInput }
  | { ok: false; message: string };

async function parseContentBlockInput(
  c: Context<AppBindings>
): Promise<ParsedContentBlockInput> {
  const body = await readJsonBody(c);
  const pageKey = getString(body, "pageKey").trim();
  const blockKey = getString(body, "blockKey").trim();
  const blockType = getString(body, "blockType").trim() || "section";
  const status = getString(body, "status").trim() || "draft";

  if (!pageKey) {
    return { ok: false, message: "Page key is required" };
  }

  if (!blockKey) {
    return { ok: false, message: "Block key is required" };
  }

  if (!blockType) {
    return { ok: false, message: "Block type is required" };
  }

  if (!STATUSES.includes(status as PublishStatus)) {
    return { ok: false, message: "Status must be draft or published" };
  }

  return {
    ok: true,
    data: {
      pageKey,
      blockKey,
      blockType,
      eyebrow: nullableString(body, "eyebrow"),
      title: nullableString(body, "title"),
      subtitle: nullableString(body, "subtitle"),
      summary: nullableString(body, "summary"),
      body: nullableString(body, "body"),
      ctaLabel: nullableString(body, "ctaLabel"),
      ctaHref: nullableString(body, "ctaHref"),
      secondaryCtaLabel: nullableString(body, "secondaryCtaLabel"),
      secondaryCtaHref: nullableString(body, "secondaryCtaHref"),
      imageUrl: nullableString(body, "imageUrl"),
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
