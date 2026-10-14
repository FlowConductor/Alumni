-- Creates the announcements table (Announcement entity; the announcement
-- feature was previously file-backed — this replaces data/announcements.json)

CREATE TABLE IF NOT EXISTS announcements (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title      VARCHAR(255)  NOT NULL,
  content    TEXT          NOT NULL,
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
