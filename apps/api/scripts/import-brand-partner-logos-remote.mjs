import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const apiDir = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(apiDir, "../..");

const API_BASE_URL = (
  process.env.API_BASE_URL ??
  "https://green-life-rwanda-api.movie-night-api.workers.dev"
).replace(/\/+$/, "");
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME ?? "green-life-rwanda-media";
const DATABASE_NAME = process.env.D1_DATABASE_NAME ?? "green-life-rwanda";
const logoDir =
  process.env.GLR_LOGO_DIR ??
  path.resolve(repoRoot, "00_INPUTS/06_green_life_logo/processed");
const partnerLogoDir =
  process.env.PARTNER_LOGO_DIR ??
  path.resolve(repoRoot, "00_INPUTS/04_partner_logos/originals");
const restoreLocalLogoDir =
  process.env.RESTORE_LOCAL_LOGO_DIR ??
  path.resolve(repoRoot, "00_INPUTS/07_partner_logos");
const pnpmCommand = "pnpm";
const uploadStagingDir = path.join(apiDir, ".tmp-remote-media-upload");
const wranglerEnv = {
  ...process.env,
  WRANGLER_NO_UPDATE_CHECK: "true",
  WRANGLER_SEND_METRICS: "false"
};

const files = [
  siteAsset(
    "media-green-life-logo-transparent-webp",
    "green-life-logo-transparent.webp",
    "logo",
    "Processed transparent Green for Life Rwanda logo",
    0
  ),
  siteAsset(
    "media-green-life-logo-transparent-png",
    "green-life-logo-transparent.png",
    "logo-png",
    "Processed transparent Green for Life Rwanda PNG logo",
    1
  ),
  siteAsset(
    "media-green-life-logo-footer-transparent-png",
    "green-life-logo-footer-transparent.png",
    "footer-logo",
    "Processed transparent Green for Life Rwanda footer logo",
    2
  ),
  siteAsset(
    "media-green-life-favicon-ico",
    "green-life-favicon.ico",
    "favicon",
    "Processed Green for Life Rwanda favicon",
    3
  ),
  siteAsset(
    "media-green-life-favicon-32-png",
    "green-life-favicon-32.png",
    "favicon-32",
    "Processed Green for Life Rwanda 32px favicon",
    4
  ),
  siteAsset(
    "media-green-life-favicon-48-png",
    "green-life-favicon-48.png",
    "favicon-48",
    "Processed Green for Life Rwanda 48px favicon",
    5
  ),
  siteAsset(
    "media-green-life-apple-touch-icon-png",
    "green-life-apple-touch-icon.png",
    "apple-touch-icon",
    "Processed Green for Life Rwanda Apple touch icon",
    6
  ),
  siteAsset(
    "media-green-life-favicon-192-png",
    "green-life-favicon-192.png",
    "icon-192",
    "Processed Green for Life Rwanda 192px icon",
    7
  ),
  siteAsset(
    "media-green-life-favicon-512-png",
    "green-life-favicon-512.png",
    "icon-512",
    "Processed Green for Life Rwanda 512px icon",
    8
  ),
  partnerLogo("partner-world-connect-logo", "world connect.JPG", "World Connect", "partner-world-connect", 1),
  partnerLogo("partner-biocoor-logo", "biocoor.JPG", "Biocoor", "partner-biocoor", 2),
  partnerLogo(
    "partner-segal-family-foundation-logo",
    "segal family foundation.JPG",
    "Segal Family Foundation",
    "partner-segal-family-foundation",
    3
  ),
  partnerLogo("partner-rgb-logo", "rgb.JPG", "RGB", "partner-rgb", 4),
  partnerLogo(
    "partner-bridge-of-hope-logo",
    "bridge of hope.JPG",
    "Bridge of Hope",
    "partner-bridge-of-hope",
    5
  ),
  partnerLogo(
    "partner-fmi-ubumuntu-logo",
    "fmi ubuntu.JPG",
    "FMI Ubumuntu",
    "partner-fmi-ubumuntu",
    6
  ),
  partnerLogo(
    "partner-restore-local-logo",
    "restore-local-logo.png",
    "Restore Local",
    "partner-restore-local",
    7,
    restoreLocalLogoDir
  )
];

for (const file of files) {
  if (!existsSync(file.filePath)) {
    throw new Error(`Required logo file is missing: ${file.filePath}`);
  }
}

const rows = [];
await resetUploadStagingDir();

for (const file of files) {
  const bytes = await readFile(file.filePath);
  const mimeType = mimeTypeForPath(file.filePath);
  const stagedPath = await stageUploadFile(file);

  runWrangler([
    "r2",
    "object",
    "put",
    `${R2_BUCKET_NAME}/${file.storageKey}`,
    "--remote",
    "--file",
    stagedPath,
    "--content-type",
    mimeType
  ]);

  rows.push({
    ...file,
    publicUrl: `${API_BASE_URL}/public/media/file/${file.id}`,
    mimeType,
    sizeBytes: bytes.byteLength,
    originalName: path.basename(file.filePath),
    fileName: path.basename(file.filePath)
  });
}

const sqlPath = path.join(os.tmpdir(), "green-life-rwanda-brand-partner-logos-remote.sql");
await writeFile(sqlPath, buildSql(rows), "utf8");

runWrangler(["d1", "execute", DATABASE_NAME, "--remote", "--file", sqlPath]);

console.log(`Imported ${rows.length} brand/partner logo files into remote R2/D1.`);
console.log(`Public URLs use ${API_BASE_URL}/public/media/file/:id`);

async function resetUploadStagingDir() {
  await rm(uploadStagingDir, { force: true, recursive: true });
  await mkdir(uploadStagingDir, { recursive: true });
}

async function stageUploadFile(file) {
  const ext = path.extname(file.filePath).toLowerCase();
  const stagedPath = path.join(uploadStagingDir, `${safeFileStem(file.id)}${ext}`);
  await copyFile(file.filePath, stagedPath);
  return stagedPath;
}

function safeFileStem(value) {
  return String(value).replace(/[^a-z0-9._-]+/gi, "-").toLowerCase();
}

function partnerLogo(id, fileName, partnerName, partnerId, displayOrder, sourceDir = partnerLogoDir) {
  return {
    id,
    filePath: path.join(sourceDir, fileName),
    storageKey: `logos/partners/${fileName.toLowerCase().replace(/[^a-z0-9.]+/g, "-")}`,
    altText: `${partnerName} logo`,
    caption: `${partnerName} logo`,
    entityType: "partner",
    entityId: partnerId,
    displayOrder
  };
}

function siteAsset(id, fileName, entityId, caption, displayOrder) {
  return {
    id,
    filePath: path.join(logoDir, fileName),
    storageKey: `logos/green-life-rwanda/${fileName}`,
    altText: caption,
    caption,
    entityType: "site",
    entityId,
    displayOrder
  };
}

function runWrangler(args) {
  if (process.platform === "win32") {
    execFileSync("cmd.exe", ["/d", "/s", "/c", buildWindowsWranglerCommand(args)], {
      cwd: apiDir,
      env: wranglerEnv,
      stdio: "inherit"
    });
    return;
  }

  execFileSync(pnpmCommand, ["exec", "wrangler", ...args], {
    cwd: apiDir,
    env: wranglerEnv,
    stdio: "inherit"
  });
}

function buildWindowsWranglerCommand(args) {
  return ["pnpm", "exec", "wrangler", ...args].map(quoteCmdArg).join(" ");
}

function quoteCmdArg(arg) {
  const value = String(arg);
  if (!/[ \t"&<>|^]/.test(value)) {
    return value;
  }

  return `"${value.replace(/"/g, '\\"')}"`;
}

function mimeTypeForPath(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".avif") return "image/avif";
  if (ext === ".ico") return "image/x-icon";
  return "image/jpeg";
}

function sqlString(value) {
  if (value === null || value === undefined) {
    return "NULL";
  }

  return `'${String(value).replace(/'/g, "''")}'`;
}

function buildSql(rows) {
  const mediaValues = rows
    .map(
      (row) => `(
  ${sqlString(row.id)},
  ${sqlString(row.originalName)},
  ${sqlString(row.fileName)},
  ${sqlString(row.mimeType)},
  ${row.sizeBytes},
  ${sqlString(row.storageKey)},
  ${sqlString(row.publicUrl)},
  ${sqlString(row.altText)},
  ${sqlString(row.caption)},
  ${sqlString(row.entityType)},
  ${sqlString(row.entityId)},
  ${row.displayOrder},
  'active',
  datetime('now'),
  datetime('now')
)`
    )
    .join(",\n");

  const urlFor = (id) => rows.find((row) => row.id === id)?.publicUrl;

  return `
PRAGMA foreign_keys = ON;

INSERT INTO media_files (
  id,
  original_name,
  file_name,
  mime_type,
  size_bytes,
  storage_key,
  public_url,
  alt_text,
  caption,
  entity_type,
  entity_id,
  display_order,
  status,
  created_at,
  updated_at
) VALUES
${mediaValues}
ON CONFLICT(id) DO UPDATE SET
  original_name = excluded.original_name,
  file_name = excluded.file_name,
  mime_type = excluded.mime_type,
  size_bytes = excluded.size_bytes,
  storage_key = excluded.storage_key,
  public_url = excluded.public_url,
  alt_text = excluded.alt_text,
  caption = excluded.caption,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id,
  display_order = excluded.display_order,
  status = excluded.status,
  updated_at = datetime('now');

INSERT INTO site_settings (key, group_key, label, value, field_type, updated_at)
VALUES
  ('site.logo_url', 'media', 'Site logo URL', ${sqlString(urlFor("media-green-life-logo-transparent-webp"))}, 'url', datetime('now')),
  ('site.footer_logo_url', 'media', 'Footer logo URL', ${sqlString(urlFor("media-green-life-logo-footer-transparent-png"))}, 'url', datetime('now')),
  ('site.favicon_url', 'media', 'Site favicon URL', ${sqlString(urlFor("media-green-life-favicon-ico"))}, 'url', datetime('now')),
  ('site.favicon_32_url', 'media', 'Favicon 32 URL', ${sqlString(urlFor("media-green-life-favicon-32-png"))}, 'url', datetime('now')),
  ('site.favicon_48_url', 'media', 'Favicon 48 URL', ${sqlString(urlFor("media-green-life-favicon-48-png"))}, 'url', datetime('now')),
  ('site.apple_touch_icon_url', 'media', 'Apple touch icon URL', ${sqlString(urlFor("media-green-life-apple-touch-icon-png"))}, 'url', datetime('now')),
  ('site.icon_192_url', 'media', 'PWA icon 192 URL', ${sqlString(urlFor("media-green-life-favicon-192-png"))}, 'url', datetime('now')),
  ('site.icon_512_url', 'media', 'PWA icon 512 URL', ${sqlString(urlFor("media-green-life-favicon-512-png"))}, 'url', datetime('now'))
ON CONFLICT(key) DO UPDATE SET
  group_key = excluded.group_key,
  label = excluded.label,
  value = excluded.value,
  field_type = excluded.field_type,
  updated_at = datetime('now');

UPDATE partners
SET website_url = CASE id
  WHEN 'partner-rgb' THEN 'https://www.rgb.rw/'
  WHEN 'partner-world-connect' THEN 'https://worldconnect-us.org/power-center/rwanda'
  WHEN 'partner-biocoor' THEN 'https://biocoor.org.rw/'
  WHEN 'partner-segal-family-foundation' THEN 'https://www.segalfamilyfoundation.org/'
  WHEN 'partner-bridge-of-hope' THEN 'https://bridgeofhope.org.rw/'
  WHEN 'partner-fmi-ubumuntu' THEN 'https://www.friendsofmotherland.org/'
  WHEN 'partner-restore-local' THEN 'https://restorelocal.org/'
  ELSE website_url
END,
is_text_only = 0,
updated_at = datetime('now')
WHERE id IN (
  'partner-rgb',
  'partner-world-connect',
  'partner-biocoor',
  'partner-segal-family-foundation',
  'partner-bridge-of-hope',
  'partner-fmi-ubumuntu',
  'partner-restore-local'
);
`;
}
