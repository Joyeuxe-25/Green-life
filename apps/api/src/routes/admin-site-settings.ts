import { Hono } from "hono";
import type { Context } from "hono";
import {
  createSiteSetting,
  deleteSiteSetting,
  findSiteSettingByKey,
  listSiteSettings,
  updateSiteSetting,
  type SiteSettingInput
} from "../db/site-settings";
import { requireAdmin } from "../middleware/require-admin";
import type { AppBindings } from "../types";
import { notFound, success, validationError } from "../utils/http";

export const adminSiteSettingsRoutes = new Hono<AppBindings>();

adminSiteSettingsRoutes.use("*", requireAdmin());

adminSiteSettingsRoutes.get("/", async (c) => {
  const settings = await listSiteSettings(c);
  return success(c, { settings });
});

adminSiteSettingsRoutes.get("/:key", async (c) => {
  const setting = await findSiteSettingByKey(c, c.req.param("key"));
  if (!setting) {
    return notFound(c, "Site setting not found");
  }

  return success(c, { setting });
});

adminSiteSettingsRoutes.post("/", async (c) => {
  const parsed = await parseSiteSettingInput(c);
  if (!parsed.ok) {
    return validationError(c, parsed.message);
  }

  const existing = await findSiteSettingByKey(c, parsed.data.key);
  if (existing) {
    return validationError(c, "Setting key is already used");
  }

  const setting = await createSiteSetting(c, parsed.data);
  return success(c, { setting }, 201);
});

adminSiteSettingsRoutes.patch("/:key", async (c) => {
  const key = c.req.param("key");
  const existing = await findSiteSettingByKey(c, key);
  if (!existing) {
    return notFound(c, "Site setting not found");
  }

  const parsed = await parseSiteSettingInput(c);
  if (!parsed.ok) {
    return validationError(c, parsed.message);
  }

  const keyOwner = await findSiteSettingByKey(c, parsed.data.key);
  if (keyOwner && keyOwner.key !== key) {
    return validationError(c, "Setting key is already used");
  }

  const setting = await updateSiteSetting(c, key, parsed.data);
  return success(c, { setting });
});

adminSiteSettingsRoutes.delete("/:key", async (c) => {
  const deleted = await deleteSiteSetting(c, c.req.param("key"));
  if (!deleted) {
    return notFound(c, "Site setting not found");
  }

  return success(c, { deleted: true });
});

type ParsedSiteSettingInput =
  | { ok: true; data: SiteSettingInput }
  | { ok: false; message: string };

async function parseSiteSettingInput(
  c: Context<AppBindings>
): Promise<ParsedSiteSettingInput> {
  const body = await readJsonBody(c);
  const key = getString(body, "key").trim();
  const label = getString(body, "label").trim();

  if (!key) {
    return { ok: false, message: "Key is required" };
  }

  if (!label) {
    return { ok: false, message: "Label is required" };
  }

  return {
    ok: true,
    data: {
      key,
      groupKey: getString(body, "groupKey").trim() || "general",
      label,
      value: nullableString(body, "value"),
      fieldType: getString(body, "fieldType").trim() || "text"
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
