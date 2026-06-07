-- Local D1 schema verification queries only.
-- Safe inspection queries: no INSERT, UPDATE, DELETE, DROP, or ALTER.

SELECT name
FROM sqlite_master
WHERE type = 'table'
ORDER BY name;

SELECT name
FROM sqlite_master
WHERE type = 'index'
ORDER BY name;

SELECT name
FROM sqlite_master
WHERE type = 'table'
  AND name IN ('reports', 'activity_logs');

PRAGMA table_info(admin);
PRAGMA table_info(staff);
PRAGMA table_info(partners);
PRAGMA table_info(news);
PRAGMA table_info(events);
PRAGMA table_info(projects);
PRAGMA table_info(media_files);
PRAGMA table_info(contact_messages);
PRAGMA table_info(donation_messages);

SELECT COUNT(*) AS admin_rows
FROM admin;
