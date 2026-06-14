import { Hono } from "hono";
import type { Context } from "hono";
import {
  createStaff,
  findStaffById,
  listStaff,
  softDeleteStaff,
  updateStaff,
  type StaffInput,
  type StaffStatus
} from "../db/staff";
import { requireAdmin } from "../middleware/require-admin";
import type { AppBindings } from "../types";
import { notFound, success, validationError } from "../utils/http";

const STAFF_STATUSES: StaffStatus[] = ["active", "hidden"];

export const adminStaffRoutes = new Hono<AppBindings>();

adminStaffRoutes.use("*", requireAdmin());

adminStaffRoutes.get("/", async (c) => {
  const staff = await listStaff(c);
  return success(c, { staff });
});

adminStaffRoutes.get("/:id", async (c) => {
  const staffMember = await findStaffById(c, c.req.param("id"));
  if (!staffMember) {
    return notFound(c, "Staff member not found");
  }

  return success(c, { staff: staffMember });
});

adminStaffRoutes.post("/", async (c) => {
  const parsed = await parseStaffInput(c);
  if (!parsed.ok) {
    return validationError(c, parsed.message);
  }

  const staffMember = await createStaff(c, parsed.data);
  return success(c, { staff: staffMember }, 201);
});

adminStaffRoutes.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await findStaffById(c, id);
  if (!existing) {
    return notFound(c, "Staff member not found");
  }

  const parsed = await parseStaffInput(c);
  if (!parsed.ok) {
    return validationError(c, parsed.message);
  }

  const staffMember = await updateStaff(c, id, parsed.data);
  return success(c, { staff: staffMember });
});

adminStaffRoutes.delete("/:id", async (c) => {
  const deleted = await softDeleteStaff(c, c.req.param("id"));
  if (!deleted) {
    return notFound(c, "Staff member not found");
  }

  return success(c, { deleted: true });
});

type ParsedStaffInput =
  | {
      ok: true;
      data: StaffInput;
    }
  | {
      ok: false;
      message: string;
    };

async function parseStaffInput(
  c: Context<AppBindings>
): Promise<ParsedStaffInput> {
  const body = await readJsonBody(c);
  const fullName = getString(body, "fullName").trim();
  const roleTitle = getString(body, "roleTitle").trim();
  const status = getString(body, "status").trim() || "active";

  if (!fullName) {
    return { ok: false, message: "Full name is required" };
  }

  if (!roleTitle) {
    return { ok: false, message: "Role title is required" };
  }

  if (!STAFF_STATUSES.includes(status as StaffStatus)) {
    return { ok: false, message: "Status must be active or hidden" };
  }

  return {
    ok: true,
    data: {
      fullName,
      roleTitle,
      shortBio: nullableString(body, "shortBio"),
      email: nullableString(body, "email"),
      phone: nullableString(body, "phone"),
      displayOrder: getInteger(body, "displayOrder"),
      status: status as StaffStatus
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
