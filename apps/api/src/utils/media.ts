export const IMAGE_MIME_TYPES = ["image/avif", "image/jpeg", "image/png", "image/webp"] as const;
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const EXTENSIONS_BY_MIME: Record<string, string> = {
  "image/avif": "avif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp"
};

export type MediaValidationResult =
  | { ok: true }
  | { ok: false; message: string };

export function validateMediaFile(file: File): MediaValidationResult {
  if (!IMAGE_MIME_TYPES.includes(file.type as (typeof IMAGE_MIME_TYPES)[number])) {
    return {
      ok: false,
      message: "File must be an AVIF, JPEG, PNG, or WebP image"
    };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return {
      ok: false,
      message: "Image file size must be 8 MB or smaller"
    };
  }

  return { ok: true };
}

export function sanitizeFileName(name: string) {
  const withoutPath = name.split(/[\\/]/).pop() || "media-file";
  const withoutExtension = withoutPath.replace(/\.[^.]+$/, "");
  const sanitized = withoutExtension
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return sanitized || "media-file";
}

export function extensionForFile(file: File) {
  const mimeExtension = EXTENSIONS_BY_MIME[file.type];
  if (mimeExtension) {
    return mimeExtension;
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return /^[a-z0-9]{2,6}$/.test(extension) ? extension : "bin";
}

export function createStoredFileName(file: File) {
  return `${sanitizeFileName(file.name)}.${extensionForFile(file)}`;
}

export function createStorageKey(file: File) {
  const date = new Date();
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const id = crypto.randomUUID();
  return `media/${year}/${month}/${id}-${createStoredFileName(file)}`;
}

export function buildPublicUrl(baseUrl: string | undefined, storageKey: string) {
  if (!baseUrl) {
    return null;
  }

  return `${baseUrl.replace(/\/+$/, "")}/${storageKey}`;
}
