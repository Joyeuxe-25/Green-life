const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ?? "";

function mediaUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

export const ADMIN_LOGO_URL = mediaUrl(
  "/public/media/file/media-green-life-logo-transparent-webp"
);

export const ADMIN_FAVICON_URL = mediaUrl(
  "/public/media/file/media-green-life-favicon-ico"
);

export const ADMIN_FAVICON_32_URL = mediaUrl(
  "/public/media/file/media-green-life-favicon-32-png"
);

export const ADMIN_APPLE_TOUCH_ICON_URL = mediaUrl(
  "/public/media/file/media-green-life-apple-touch-icon-png"
);
