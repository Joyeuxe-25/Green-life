import { Hono } from "hono";
import type { Context } from "hono";
import {
  createMediaFile,
  findMediaById,
  listMediaFiles,
  markMediaDeleted,
  updateMediaFile,
  type MediaStatus
} from "../db/media";
import { requireAdmin } from "../middleware/require-admin";
import type { AppBindings } from "../types";
import { notFound, success, validationError } from "../utils/http";
import {
  buildPublicUrl,
  createStorageKey,
  createStoredFileName,
  validateMediaFile
} from "../utils/media";

const MEDIA_STATUSES: MediaStatus[] = ["active", "hidden", "deleted"];

export const adminMediaRoutes = new Hono<AppBindings>();

adminMediaRoutes.use("*", requireAdmin());

adminMediaRoutes.get("/", async (c) => {
  const status = getStatus(c.req.query("status"));
  if (c.req.query("status") && !status) {
    return validationError(c, "Status must be active, hidden, or deleted");
  }

  const media = await listMediaFiles(c, {
    entityType: nullableQuery(c.req.query("entity_type")),
    entityId: nullableQuery(c.req.query("entity_id")),
    status,
    q: nullableQuery(c.req.query("q") ?? c.req.query("search"))
  });

  return success(c, { media });
});

adminMediaRoutes.get("/:id", async (c) => {
  const media = await findMediaById(c, c.req.param("id"));
  if (!media || media.status === "deleted") {
    return notFound(c, "Media file not found");
  }

  return success(c, { media });
});

adminMediaRoutes.post("/upload", async (c) => {
  const formData = await c.req.raw.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return validationError(c, "File is required");
  }

  const validation = validateMediaFile(file);
  if (!validation.ok) {
    return validationError(c, validation.message);
  }

  const storageKey = createStorageKey(file);
  const fileName = createStoredFileName(file);
  const bytes = await file.arrayBuffer();

  await c.env.MEDIA_BUCKET.put(storageKey, bytes, {
    httpMetadata: {
      contentType: file.type
    }
  });

  try {
    const media = await createMediaFile(c, {
      originalName: file.name || fileName,
      fileName,
      mimeType: file.type,
      sizeBytes: file.size,
      storageKey,
      publicUrl: buildPublicUrl(c.env.R2_PUBLIC_BASE_URL, storageKey),
      altText: nullableFormString(formData, "alt_text"),
      caption: nullableFormString(formData, "caption"),
      entityType: nullableFormString(formData, "entity_type"),
      entityId: nullableFormString(formData, "entity_id"),
      displayOrder: formInteger(formData, "display_order")
    });

    return success(c, { media }, 201);
  } catch (error) {
    await c.env.MEDIA_BUCKET.delete(storageKey).catch(() => undefined);
    throw error;
  }
});

adminMediaRoutes.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await findMediaById(c, id);
  if (!existing || existing.status === "deleted") {
    return notFound(c, "Media file not found");
  }

  const body = await readJsonBody(c);
  const status = getStatus(getString(body, "status") || existing.status);
  if (!status) {
    return validationError(c, "Status must be active, hidden, or deleted");
  }

  const media = await updateMediaFile(c, id, {
    altText: nullableString(body, "altText"),
    caption: nullableString(body, "caption"),
    entityType: nullableString(body, "entityType"),
    entityId: nullableString(body, "entityId"),
    displayOrder: getInteger(body, "displayOrder"),
    status
  });

  return success(c, { media });
});

adminMediaRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const media = await findMediaById(c, id);
  if (!media || media.status === "deleted") {
    return notFound(c, "Media file not found");
  }

  await c.env.MEDIA_BUCKET.delete(media.storage_key);
  const deleted = await markMediaDeleted(c, id);
  if (!deleted) {
    return notFound(c, "Media file not found");
  }

  return success(c, { deleted: true });
});

function nullableQuery(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function getStatus(value: string | undefined | null) {
  const trimmed = value?.trim();
  return MEDIA_STATUSES.includes(trimmed as MediaStatus)
    ? (trimmed as MediaStatus)
    : null;
}

function nullableFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function formInteger(formData: FormData, key: string) {
  const value = formData.get(key);
  const parsed = typeof value === "string" ? Number.parseInt(value, 10) : 0;
  return Number.isFinite(parsed) ? Math.trunc(parsed) : 0;
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
