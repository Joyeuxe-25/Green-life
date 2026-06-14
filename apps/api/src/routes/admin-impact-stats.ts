import { Hono } from "hono";
import type { Context } from "hono";
import {
  createImpactStat,
  deleteImpactStat,
  findImpactStatById,
  listImpactStats,
  updateImpactStat,
  type ImpactStatInput
} from "../db/impact-stats";
import type { PublishStatus } from "../db/content-blocks";
import { requireAdmin } from "../middleware/require-admin";
import type { AppBindings } from "../types";
import { notFound, success, validationError } from "../utils/http";

const STATUSES: PublishStatus[] = ["draft", "published"];

export const adminImpactStatsRoutes = new Hono<AppBindings>();

adminImpactStatsRoutes.use("*", requireAdmin());

adminImpactStatsRoutes.get("/", async (c) => {
  const stats = await listImpactStats(c);
  return success(c, { stats });
});

adminImpactStatsRoutes.get("/:id", async (c) => {
  const stat = await findImpactStatById(c, c.req.param("id"));
  if (!stat) {
    return notFound(c, "Impact stat not found");
  }

  return success(c, { stat });
});

adminImpactStatsRoutes.post("/", async (c) => {
  const parsed = await parseImpactStatInput(c);
  if (!parsed.ok) {
    return validationError(c, parsed.message);
  }

  const stat = await createImpactStat(c, parsed.data);
  return success(c, { stat }, 201);
});

adminImpactStatsRoutes.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await findImpactStatById(c, id);
  if (!existing) {
    return notFound(c, "Impact stat not found");
  }

  const parsed = await parseImpactStatInput(c);
  if (!parsed.ok) {
    return validationError(c, parsed.message);
  }

  const stat = await updateImpactStat(c, id, parsed.data);
  return success(c, { stat });
});

adminImpactStatsRoutes.delete("/:id", async (c) => {
  const deleted = await deleteImpactStat(c, c.req.param("id"));
  if (!deleted) {
    return notFound(c, "Impact stat not found");
  }

  return success(c, { deleted: true });
});

type ParsedImpactStatInput =
  | { ok: true; data: ImpactStatInput }
  | { ok: false; message: string };

async function parseImpactStatInput(
  c: Context<AppBindings>
): Promise<ParsedImpactStatInput> {
  const body = await readJsonBody(c);
  const label = getString(body, "label").trim();
  const value = getString(body, "value").trim();
  const status = getString(body, "status").trim() || "draft";

  if (!label) {
    return { ok: false, message: "Label is required" };
  }

  if (!value) {
    return { ok: false, message: "Value is required" };
  }

  if (!STATUSES.includes(status as PublishStatus)) {
    return { ok: false, message: "Status must be draft or published" };
  }

  return {
    ok: true,
    data: {
      label,
      value,
      suffix: nullableString(body, "suffix"),
      description: nullableString(body, "description"),
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
