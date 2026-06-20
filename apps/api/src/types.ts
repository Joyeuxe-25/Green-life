export type Env = {
  DATABASE: D1Database;
  MEDIA_BUCKET: R2Bucket;
  R2_PUBLIC_BASE_URL?: string;
  ADMIN_SESSION_SECRET?: string;
  ADMIN_SESSION_COOKIE_NAME?: string;
  ADMIN_SESSION_EXPIRES_DAYS?: string;
  ENABLE_ADMIN_SETUP?: string;
  ADMIN_SETUP_KEY?: string;
  ADMIN_SETUP_SECRET?: string;
  COOKIE_DOMAIN?: string;
  PUBLIC_SITE_URL?: string;
  ADMIN_SITE_URL?: string;
  CORS_ALLOWED_ORIGINS?: string;
};

export type AppBindings = {
  Bindings: Env;
  Variables: {
    admin?: SafeAdmin;
  };
};

export type SafeAdmin = {
  id: string;
  name: string;
  email: string;
};
