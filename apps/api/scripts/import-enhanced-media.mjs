import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8787";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const ENHANCED_MEDIA_DIR =
  process.env.ENHANCED_MEDIA_DIR ??
  path.resolve(scriptDir, "../../../00_INPUTS/05_enhanced_avif_media/extracted/assets/images");
const MANIFEST_PATH =
  process.env.ENHANCED_MEDIA_MANIFEST ??
  path.resolve(scriptDir, "../../../00_INPUTS/05_enhanced_avif_media/enhanced-media-import-manifest.json");

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required.");
}

const manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
const cookie = await login();

for (const item of manifest) {
  const filePath = path.join(ENHANCED_MEDIA_DIR, item.file_name);
  const bytes = await readFile(filePath);
  const formData = new FormData();

  formData.set(
    "file",
    new Blob([bytes], { type: item.mime_type || "image/avif" }),
    item.file_name
  );
  formData.set("alt_text", item.recommended_alt_text ?? "");
  formData.set("caption", item.recommended_caption ?? "");
  formData.set("display_order", String(item.display_order ?? 0));

  const response = await fetch(`${API_BASE_URL}/admin/media/upload`, {
    method: "POST",
    headers: {
      Cookie: cookie
    },
    body: formData
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to upload ${item.file_name}: ${response.status} ${body}`);
  }

  console.log(`Uploaded ${item.file_name}`);
}

async function login() {
  const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Admin login failed: ${response.status} ${body}`);
  }

  const setCookie = getSetCookie(response.headers);
  if (!setCookie) {
    throw new Error("Admin login did not return a session cookie.");
  }

  return setCookie
    .map((cookieHeader) => cookieHeader.split(";")[0])
    .filter(Boolean)
    .join("; ");
}

function getSetCookie(headers) {
  if (typeof headers.getSetCookie === "function") {
    return headers.getSetCookie();
  }

  const cookie = headers.get("set-cookie");
  return cookie ? [cookie] : [];
}
