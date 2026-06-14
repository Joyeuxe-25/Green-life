CREATE TABLE IF NOT EXISTS content_blocks (
  id TEXT PRIMARY KEY,
  page_key TEXT NOT NULL,
  block_key TEXT NOT NULL,
  block_type TEXT NOT NULL DEFAULT 'section',
  eyebrow TEXT,
  title TEXT,
  subtitle TEXT,
  summary TEXT,
  body TEXT,
  cta_label TEXT,
  cta_href TEXT,
  secondary_cta_label TEXT,
  secondary_cta_href TEXT,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_content_blocks_page_block
  ON content_blocks (page_key, block_key);
CREATE INDEX IF NOT EXISTS idx_content_blocks_page_order
  ON content_blocks (page_key, status, display_order);
CREATE INDEX IF NOT EXISTS idx_content_blocks_status
  ON content_blocks (status);

CREATE TABLE IF NOT EXISTS impact_stats (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  suffix TEXT,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_impact_stats_status_order
  ON impact_stats (status, display_order);

CREATE TABLE IF NOT EXISTS programs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  body TEXT,
  icon_name TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_programs_status_order
  ON programs (status, display_order);
CREATE INDEX IF NOT EXISTS idx_programs_slug
  ON programs (slug);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  group_key TEXT NOT NULL DEFAULT 'general',
  label TEXT NOT NULL,
  value TEXT,
  field_type TEXT NOT NULL DEFAULT 'text',
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_site_settings_group
  ON site_settings (group_key);
