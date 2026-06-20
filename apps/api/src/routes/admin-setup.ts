import { Hono } from "hono";
import type { Context } from "hono";
import { countAdmins, createAdmin } from "../db/admin";
import type { AppBindings } from "../types";
import {
  errorResponse,
  forbidden,
  notFound,
  success,
  unauthorized,
  validationError
} from "../utils/http";
import { hashPassword } from "../utils/password";

const SETUP_SECRET_HEADER = "x-admin-setup-secret";

export const adminSetupRoutes = new Hono<AppBindings>();

adminSetupRoutes.post("/", async (c) => {
  return createFirstAdmin(c, "body");
});

adminSetupRoutes.post("/first-admin", async (c) => {
  return createFirstAdmin(c, "header");
});

async function createFirstAdmin(c: Context<AppBindings>, setupKeySource: "body" | "header") {
  // First-admin setup must stay disabled except during a controlled setup window.
  // Disable ENABLE_ADMIN_SETUP immediately after the first admin account is created.
  if (c.env.ENABLE_ADMIN_SETUP !== "true") {
    return notFound(c);
  }

  const body = await readJsonBody(c);
  const expectedSetupKey = c.env.ADMIN_SETUP_KEY || c.env.ADMIN_SETUP_SECRET;
  if (!expectedSetupKey) {
    return errorResponse(c, "Admin setup key is not configured", 500);
  }

  const providedSetupKey =
    setupKeySource === "body"
      ? getString(body, "setupKey")
      : c.req.header(SETUP_SECRET_HEADER) ?? getString(body, "setupKey");

  if (!timingSafeStringEqual(providedSetupKey, expectedSetupKey)) {
    return unauthorized(c, "Invalid setup key");
  }

  const existingAdmins = await countAdmins(c);
  if (existingAdmins > 0) {
    return forbidden(c, "First admin setup is already complete");
  }

  const name = getString(body, "name").trim();
  const email = getString(body, "email").trim().toLowerCase();
  const password = getString(body, "password");

  if (!name || !email || !password) {
    return validationError(
      c,
      "Name, email, and password are required"
    );
  }

  if (!isValidEmail(email)) {
    return validationError(c, "A valid email address is required");
  }

  if (!isStrongEnoughPassword(password)) {
    return validationError(
      c,
      "Password must be at least 12 characters and include letters and numbers"
    );
  }

  const passwordHash = await hashPassword(password);
  await createAdmin(c, {
    name,
    email,
    passwordHash
  });

  return success(
    c,
    {
      message: "First admin account created successfully"
    },
    201
  );
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

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongEnoughPassword(password: string) {
  return password.length >= 12 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

function timingSafeStringEqual(left: string, right: string) {
  const encoder = new TextEncoder();
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);

  if (leftBytes.length !== rightBytes.length) {
    return false;
  }

  let difference = 0;
  for (let index = 0; index < leftBytes.length; index += 1) {
    difference |= leftBytes[index] ^ rightBytes[index];
  }

  return difference === 0;
}
