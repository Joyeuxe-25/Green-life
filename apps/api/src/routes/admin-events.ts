import { Hono } from "hono";
import type { Context } from "hono";
import {
  createEvent,
  findEventById,
  findEventBySlug,
  listEvents,
  softDeleteEvent,
  updateEvent,
  type EventInput,
  type EventStatus
} from "../db/events";
import { requireAdmin } from "../middleware/require-admin";
import type { AppBindings } from "../types";
import { notFound, success, validationError } from "../utils/http";

const EVENT_STATUSES: EventStatus[] = [
  "draft",
  "upcoming",
  "completed",
  "cancelled"
];

export const adminEventsRoutes = new Hono<AppBindings>();

adminEventsRoutes.use("*", requireAdmin());

adminEventsRoutes.get("/", async (c) => {
  const events = await listEvents(c);
  return success(c, { events });
});

adminEventsRoutes.get("/:id", async (c) => {
  const event = await findEventById(c, c.req.param("id"));
  if (!event) {
    return notFound(c, "Event not found");
  }

  return success(c, { event });
});

adminEventsRoutes.post("/", async (c) => {
  const parsed = await parseEventInput(c);
  if (!parsed.ok) {
    return validationError(c, parsed.message);
  }

  const slug = await ensureUniqueSlug(c, parsed.data.slug);
  const event = await createEvent(c, {
    ...parsed.data,
    slug
  });

  return success(c, { event }, 201);
});

adminEventsRoutes.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await findEventById(c, id);
  if (!existing) {
    return notFound(c, "Event not found");
  }

  const parsed = await parseEventInput(c);
  if (!parsed.ok) {
    return validationError(c, parsed.message);
  }

  const slugOwner = await findEventBySlug(c, parsed.data.slug);
  if (slugOwner && slugOwner.id !== id) {
    return validationError(c, "Slug is already used by another event");
  }

  const event = await updateEvent(c, id, parsed.data);
  return success(c, { event });
});

adminEventsRoutes.delete("/:id", async (c) => {
  const deleted = await softDeleteEvent(c, c.req.param("id"));
  if (!deleted) {
    return notFound(c, "Event not found");
  }

  return success(c, { deleted: true });
});

type ParsedEventInput =
  | {
      ok: true;
      data: EventInput;
    }
  | {
      ok: false;
      message: string;
    };

async function parseEventInput(c: Context<AppBindings>): Promise<ParsedEventInput> {
  const body = await readJsonBody(c);
  const title = getString(body, "title").trim();
  const description = getString(body, "description").trim();
  const providedSlug = getString(body, "slug").trim();
  const eventDate = getString(body, "eventDate").trim();
  const status = getString(body, "status").trim() || "draft";

  if (!title) {
    return { ok: false, message: "Title is required" };
  }

  if (!description) {
    return { ok: false, message: "Description is required" };
  }

  if (!eventDate) {
    return { ok: false, message: "Event date is required" };
  }

  if (Number.isNaN(new Date(eventDate).getTime())) {
    return { ok: false, message: "Event date must be valid" };
  }

  if (!EVENT_STATUSES.includes(status as EventStatus)) {
    return {
      ok: false,
      message: "Status must be draft, upcoming, completed, or cancelled"
    };
  }

  return {
    ok: true,
    data: {
      title,
      slug: slugify(providedSlug || title),
      description,
      eventDate: new Date(eventDate).toISOString(),
      startTime: nullableString(body, "startTime"),
      endTime: nullableString(body, "endTime"),
      location: nullableString(body, "location"),
      category: nullableString(body, "category"),
      status: status as EventStatus
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

  return slug || `event-${Date.now()}`;
}

async function ensureUniqueSlug(c: Context<AppBindings>, slug: string) {
  let candidate = slug;
  for (let index = 2; index < 50; index += 1) {
    const existing = await findEventBySlug(c, candidate);
    if (!existing) {
      return candidate;
    }
    candidate = `${slug}-${index}`;
  }

  return `${slug}-${Date.now()}`;
}
