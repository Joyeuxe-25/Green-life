export type Env = {
  DATABASE: D1Database;
  MEDIA_BUCKET: R2Bucket;
  ADMIN_JWT_SECRET?: string;
  SESSION_SECRET?: string;
  PUBLIC_SITE_URL?: string;
  ADMIN_SITE_URL?: string;
  CORS_ALLOWED_ORIGINS?: string;
};
