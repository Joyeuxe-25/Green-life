-- Green Life Rwanda D1 initial schema
-- Phase 6 reviewed schema only. Do not apply until explicitly approved.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS admin (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_updated_at TEXT,
  last_login_at TEXT,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  short_bio TEXT,
  email TEXT,
  phone TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'hidden')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS partners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  website_url TEXT,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'hidden')),
  is_text_only INTEGER NOT NULL DEFAULT 0 CHECK (is_text_only IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  published_at TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  seo_title TEXT,
  seo_description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  event_date TEXT NOT NULL,
  start_time TEXT,
  end_time TEXT,
  location TEXT,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'upcoming', 'completed', 'cancelled')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  district TEXT,
  sector TEXT,
  start_date TEXT,
  end_date TEXT,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed')),
  category TEXT,
  impact_summary TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS media_files (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('news', 'event', 'project', 'staff', 'partner')),
  entity_id TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'logo', 'document')),
  mime_type TEXT NOT NULL,
  original_name TEXT NOT NULL,
  r2_key TEXT NOT NULL UNIQUE,
  file_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  is_cover INTEGER NOT NULL DEFAULT 0 CHECK (is_cover IN (0, 1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  sender_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS donation_messages (
  id TEXT PRIMARY KEY,
  donor_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  intended_amount TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_admin_is_active ON admin (is_active);

CREATE INDEX IF NOT EXISTS idx_staff_status_order ON staff (status, display_order);
CREATE INDEX IF NOT EXISTS idx_staff_deleted_at ON staff (deleted_at);

CREATE INDEX IF NOT EXISTS idx_partners_status_order ON partners (status, display_order);
CREATE INDEX IF NOT EXISTS idx_partners_deleted_at ON partners (deleted_at);

CREATE INDEX IF NOT EXISTS idx_news_status_published_at ON news (status, published_at);
CREATE INDEX IF NOT EXISTS idx_news_category ON news (category);
CREATE INDEX IF NOT EXISTS idx_news_deleted_at ON news (deleted_at);

CREATE INDEX IF NOT EXISTS idx_events_status_event_date ON events (status, event_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events (category);
CREATE INDEX IF NOT EXISTS idx_events_deleted_at ON events (deleted_at);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects (category);
CREATE INDEX IF NOT EXISTS idx_projects_district ON projects (district);
CREATE INDEX IF NOT EXISTS idx_projects_deleted_at ON projects (deleted_at);

CREATE INDEX IF NOT EXISTS idx_media_entity ON media_files (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_media_entity_cover ON media_files (entity_type, entity_id, is_cover);
CREATE INDEX IF NOT EXISTS idx_media_entity_order ON media_files (entity_type, entity_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_media_file_type ON media_files (file_type);
CREATE INDEX IF NOT EXISTS idx_media_deleted_at ON media_files (deleted_at);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status_created ON contact_messages (status, created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages (email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_deleted_at ON contact_messages (deleted_at);

CREATE INDEX IF NOT EXISTS idx_donation_messages_status_created ON donation_messages (status, created_at);
CREATE INDEX IF NOT EXISTS idx_donation_messages_email ON donation_messages (email);
CREATE INDEX IF NOT EXISTS idx_donation_messages_deleted_at ON donation_messages (deleted_at);
