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
const ENHANCED_MEDIA_DIR =
  process.env.ENHANCED_MEDIA_DIR ??
  path.resolve(repoRoot, "00_INPUTS/05_enhanced_avif_media/extracted/assets/images");
const MANIFEST_PATH =
  process.env.ENHANCED_MEDIA_MANIFEST ??
  path.resolve(repoRoot, "00_INPUTS/05_enhanced_avif_media/enhanced-media-import-manifest.json");
const pnpmCommand = "pnpm";
const uploadStagingDir = path.join(apiDir, ".tmp-remote-media-upload");
const wranglerEnv = {
  ...process.env,
  WRANGLER_NO_UPDATE_CHECK: "true",
  WRANGLER_SEND_METRICS: "false"
};

const contentBlockImageMap = [
  ["home", "hero", "community-seedling-training.avif"],
  ["home", "mission-preview", "tree-nursery-landscape.avif"],
  ["home", "support-cta", "fruit-tree-plantation.avif"],
  ["programs", "intro", "tree-planting-demonstration.avif"],
  ["projects", "intro", "tree-planting-demonstration.avif"],
  ["partners", "intro", "community-seedling-training.avif"],
  ["impact", "intro", "farmers-with-grevillea-seedlings.avif"],
  ["contact", "intro", "community-listening-session.avif"],
  ["donate", "intro", "fruit-tree-plantation.avif"],
  ["get-involved", "intro", "youth-community-seedling-training.avif"],
  ["about", "mission", "tree-nursery-landscape.avif"],
  ["about", "history", "community-field-activity.avif"]
];

const projectImageMap = [
  ["project-mushonyi-restoration", "grevillea-seedlings-for-planting.avif"],
  ["project-nyanza-environmental-clubs", "tree-nursery-group.avif"],
  ["project-school-greening", "youth-community-seedling-training.avif"]
];

const optionalCollectionMap = [
  ["news", "community-field-activity.avif"],
  ["event", "community-field-meeting.avif"]
];

if (!existsSync(MANIFEST_PATH)) {
  throw new Error(`Manifest not found: ${MANIFEST_PATH}`);
}

if (!existsSync(ENHANCED_MEDIA_DIR)) {
  throw new Error(`Enhanced media directory not found: ${ENHANCED_MEDIA_DIR}`);
}

const manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
const avifItems = manifest.filter((item) => item.mime_type === "image/avif");

if (avifItems.length !== 30) {
  throw new Error(`Expected 30 AVIF images, found ${avifItems.length}`);
}

const rows = [];
await resetUploadStagingDir();

for (const item of avifItems) {
  const filePath = path.join(ENHANCED_MEDIA_DIR, item.file_name);
  if (!existsSync(filePath)) {
    throw new Error(`Missing enhanced media file: ${filePath}`);
  }

  const id = mediaIdForFile(item.file_name);
  const storageKey = `enhanced/green-life-rwanda/${item.file_name}`;
  const publicUrl = `${API_BASE_URL}/public/media/file/${id}`;
  const sizeBytes = (await readFile(filePath)).byteLength;
  const stagedPath = await stageUploadFile(id, filePath);

  runWrangler([
    "r2",
    "object",
    "put",
    `${R2_BUCKET_NAME}/${storageKey}`,
    "--remote",
    "--file",
    stagedPath,
    "--content-type",
    item.mime_type
  ]);

  rows.push({
    id,
    originalName: item.file_name,
    fileName: item.file_name,
    mimeType: item.mime_type,
    sizeBytes,
    storageKey,
    publicUrl,
    altText: item.recommended_alt_text ?? null,
    caption: item.recommended_caption ?? null,
    displayOrder: Number.isFinite(item.display_order) ? item.display_order : 0
  });
}

const sqlPath = path.join(os.tmpdir(), "green-life-rwanda-enhanced-media-remote.sql");
await writeFile(sqlPath, buildSql(rows), "utf8");

runWrangler(["d1", "execute", DATABASE_NAME, "--remote", "--file", sqlPath]);

console.log(`Imported ${rows.length} enhanced AVIF media files into remote R2/D1.`);
console.log(`Public URLs use ${API_BASE_URL}/public/media/file/:id`);

async function resetUploadStagingDir() {
  await rm(uploadStagingDir, { force: true, recursive: true });
  await mkdir(uploadStagingDir, { recursive: true });
}

async function stageUploadFile(id, sourcePath) {
  const ext = path.extname(sourcePath).toLowerCase();
  const stagedPath = path.join(uploadStagingDir, `${safeFileStem(id)}${ext}`);
  await copyFile(sourcePath, stagedPath);
  return stagedPath;
}

function safeFileStem(value) {
  return String(value).replace(/[^a-z0-9._-]+/gi, "-").toLowerCase();
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

function mediaIdForFile(fileName) {
  return `enhanced-${fileName.replace(/\.avif$/i, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
}

function publicUrlFor(fileName) {
  return `${API_BASE_URL}/public/media/file/${mediaIdForFile(fileName)}`;
}

function sqlString(value) {
  if (value === null || value === undefined) {
    return "NULL";
  }

  return `'${String(value).replace(/'/g, "''")}'`;
}

function buildSql(mediaRows) {
  const mediaValues = mediaRows
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
  NULL,
  NULL,
  ${row.displayOrder},
  'active',
  datetime('now'),
  datetime('now')
)`
    )
    .join(",\n");

  const contentUpdates = contentBlockImageMap
    .map(
      ([pageKey, blockKey, fileName]) => `
UPDATE content_blocks
SET image_url = ${sqlString(publicUrlFor(fileName))}, updated_at = datetime('now')
WHERE page_key = ${sqlString(pageKey)} AND block_key = ${sqlString(blockKey)};`
    )
    .join("\n");

  const projectUpdates = projectImageMap
    .map(
      ([projectId, fileName], index) => `
UPDATE media_files
SET entity_type = 'project',
    entity_id = ${sqlString(projectId)},
    display_order = ${index + 1},
    status = 'active',
    updated_at = datetime('now')
WHERE id = ${sqlString(mediaIdForFile(fileName))};`
    )
    .join("\n");

  const optionalUpdates = optionalCollectionMap
    .map(
      ([entityType, fileName], index) => `
UPDATE media_files
SET entity_type = ${sqlString(entityType)},
    entity_id = (
      SELECT id FROM ${entityType === "news" ? "news" : "events"}
      WHERE status ${entityType === "news" ? "= 'published'" : "IN ('upcoming', 'completed')"}
      ORDER BY ${entityType === "news" ? "COALESCE(published_at, created_at) DESC" : "event_date ASC"}
      LIMIT 1
    ),
    display_order = ${index + 1},
    status = 'active',
    updated_at = datetime('now')
WHERE id = ${sqlString(mediaIdForFile(fileName))}
  AND EXISTS (
    SELECT 1 FROM ${entityType === "news" ? "news" : "events"}
    WHERE status ${entityType === "news" ? "= 'published'" : "IN ('upcoming', 'completed')"}
    LIMIT 1
  );`
    )
    .join("\n");

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
  display_order = excluded.display_order,
  status = excluded.status,
  updated_at = datetime('now');

${contentUpdates}

${projectUpdates}

${optionalUpdates}
`;
}
