import { Hono } from "hono";
import type { Context } from "hono";
import { countActiveAdmins, createAdmin } from "../db/admin";
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

adminSetupRoutes.post("/first-admin", async (c) => {
  // First-admin setup must stay disabled except during a controlled setup window.
  // Disable ENABLE_ADMIN_SETUP immediately after the first admin account is created.
  if (c.env.ENABLE_ADMIN_SETUP !== "true") {
    return notFound(c);
  }

  const expectedSecret = c.env.ADMIN_SETUP_SECRET;
  if (!expectedSecret) {
    return errorResponse(c, "Admin setup secret is not configured", 500);
  }

  const providedSecret = c.req.header(SETUP_SECRET_HEADER) ?? "";
  if (!timingSafeStringEqual(providedSecret, expectedSecret)) {
    return unauthorized(c, "Invalid setup secret");
  }

  const existingActiveAdmins = await countActiveAdmins(c);
  if (existingActiveAdmins > 0) {
    return forbidden(c, "First admin setup is already complete");
  }

  const body = await readJsonBody(c);
  const name = getString(body, "name").trim();
  const email = getString(body, "email").trim().toLowerCase();
  const password = getString(body, "password");
  const confirmPassword = getString(body, "confirmPassword");

  if (!name || !email || !password || !confirmPassword) {
    return validationError(
      c,
      "Name, email, password, and password confirmation are required"
    );
  }

  if (!isValidEmail(email)) {
    return validationError(c, "A valid email address is required");
  }

  if (password !== confirmPassword) {
    return validationError(c, "Password and confirmation do not match");
  }

  if (!isStrongEnoughPassword(password)) {
    return validationError(
      c,
      "Password must be at least 12 characters and include letters and numbers"
    );
  }

  const passwordHash = await hashPassword(password);
  const admin = await createAdmin(c, {
    name,
    email,
    passwordHash
  });

  return success(
    c,
    {
      admin
    },
    201
  );
});

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
