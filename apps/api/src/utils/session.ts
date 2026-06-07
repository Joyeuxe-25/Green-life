import type { Context } from "hono";
import {
  DEFAULT_ADMIN_SESSION_COOKIE_NAME,
  getAdminSessionCookieName,
  getAdminSessionExpiresDays
} from "../config/cookies";
import type { AppBindings } from "../types";

export type AdminSessionPayload = {
  adminId: string;
  email: string;
  expiresAt: number;
};

function toBase64Url(bytes: ArrayBuffer | Uint8Array) {
  const array = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (const byte of array) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function timingSafeEqual(left: string, right: string) {
  const leftBytes = new TextEncoder().encode(left);
  const rightBytes = new TextEncoder().encode(right);

  if (leftBytes.length !== rightBytes.length) {
    return false;
  }

  let difference = 0;
  for (let index = 0; index < leftBytes.length; index += 1) {
    difference |= leftBytes[index] ^ rightBytes[index];
  }

  return difference === 0;
}

async function createSignature(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value)
  );

  return toBase64Url(signature);
}

function getCookieValue(cookieHeader: string | undefined, cookieName: string) {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const prefix = `${cookieName}=`;
  const match = cookies.find((cookie) => cookie.startsWith(prefix));

  return match ? decodeURIComponent(match.slice(prefix.length)) : null;
}

function serializeCookie(
  name: string,
  value: string,
  options: {
    expires?: Date;
    maxAge?: number;
    domain?: string;
    secure?: boolean;
  } = {}
) {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax"
  ];

  if (options.secure) {
    parts.push("Secure");
  }

  if (options.domain) {
    parts.push(`Domain=${options.domain}`);
  }

  if (options.expires) {
    parts.push(`Expires=${options.expires.toUTCString()}`);
  }

  if (typeof options.maxAge === "number") {
    parts.push(`Max-Age=${options.maxAge}`);
  }

  return parts.join("; ");
}

function shouldUseSecureCookie(c: Context<AppBindings>) {
  return new URL(c.req.url).protocol === "https:";
}

export function createAdminSessionCookiePayload(
  adminId: string,
  email: string,
  expiresAt: number
): AdminSessionPayload {
  return {
    adminId,
    email,
    expiresAt
  };
}

export async function signSession(
  payload: AdminSessionPayload,
  secret: string
): Promise<string> {
  const encodedPayload = toBase64Url(
    new TextEncoder().encode(JSON.stringify(payload))
  );
  const signature = await createSignature(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export async function verifySession(
  cookieValue: string,
  secret: string
): Promise<AdminSessionPayload | null> {
  const [encodedPayload, signature] = cookieValue.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = await createSignature(encodedPayload, secret);
  if (!timingSafeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payloadText = new TextDecoder().decode(fromBase64Url(encodedPayload));
    const payload = JSON.parse(payloadText) as AdminSessionPayload;

    if (!payload.adminId || !payload.email || payload.expiresAt <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getSessionFromCookie(c: Context<AppBindings>) {
  const secret = c.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    return null;
  }

  const cookieName = getAdminSessionCookieName(c.env);
  const cookieValue = getCookieValue(c.req.header("Cookie"), cookieName);

  return cookieValue ? verifySession(cookieValue, secret) : null;
}

export function setAdminSessionCookie(c: Context<AppBindings>, sessionValue: string) {
  const cookieName = getAdminSessionCookieName(c.env);
  const expiresDays = getAdminSessionExpiresDays(c.env);
  const maxAge = expiresDays * 24 * 60 * 60;

  c.header(
    "Set-Cookie",
    serializeCookie(cookieName, sessionValue, {
      maxAge,
      domain: c.env.COOKIE_DOMAIN,
      secure: shouldUseSecureCookie(c)
    }),
    { append: true }
  );
}

export function clearAdminSessionCookie(c: Context<AppBindings>) {
  c.header(
    "Set-Cookie",
    serializeCookie(getAdminSessionCookieName(c.env), "", {
      expires: new Date(0),
      maxAge: 0,
      domain: c.env.COOKIE_DOMAIN,
      secure: shouldUseSecureCookie(c)
    }),
    { append: true }
  );
}

export function getDefaultAdminCookieName() {
  return DEFAULT_ADMIN_SESSION_COOKIE_NAME;
}
