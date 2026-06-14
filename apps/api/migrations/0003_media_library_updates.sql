DROP INDEX IF EXISTS idx_media_entity;
DROP INDEX IF EXISTS idx_media_entity_cover;
DROP INDEX IF EXISTS idx_media_entity_order;
DROP INDEX IF EXISTS idx_media_file_type;
DROP INDEX IF EXISTS idx_media_deleted_at;

ALTER TABLE media_files RENAME TO media_files_legacy;

CREATE TABLE IF NOT EXISTS media_files (
  id TEXT PRIMARY KEY,
  original_name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  storage_key TEXT NOT NULL UNIQUE,
  public_url TEXT,
  alt_text TEXT,
  caption TEXT,
  entity_type TEXT,
  entity_id TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'deleted')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

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
)
SELECT
  id,
  original_name,
  original_name,
  mime_type,
  0,
  r2_key,
  file_url,
  alt_text,
  caption,
  entity_type,
  entity_id,
  sort_order,
  CASE WHEN deleted_at IS NULL THEN 'active' ELSE 'deleted' END,
  created_at,
  updated_at
FROM media_files_legacy;

DROP TABLE media_files_legacy;

CREATE INDEX IF NOT EXISTS idx_media_files_entity
  ON media_files (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_media_files_status
  ON media_files (status);
CREATE INDEX IF NOT EXISTS idx_media_files_created_at
  ON media_files (created_at);
