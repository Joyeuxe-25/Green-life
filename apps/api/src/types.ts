export type Env = {
  DATABASE: D1Database;
  MEDIA_BUCKET: R2Bucket;
  ADMIN_SESSION_SECRET?: string;
  ADMIN_SESSION_COOKIE_NAME?: string;
  ADMIN_SESSION_EXPIRES_DAYS?: string;
  PUBLIC_SITE_URL?: string;
  ADMIN_SITE_URL?: string;
  CORS_ALLOWED_ORIGINS?: string;
};

export type AppBindings = {
  Bindings: Env;
};
