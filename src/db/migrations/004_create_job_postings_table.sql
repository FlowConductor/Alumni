-- Creates the job_postings table (Job Posting entity, Career Services context; see ddd.md)

CREATE TABLE IF NOT EXISTS job_postings (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  posted_by   BIGINT UNSIGNED NULL,
  title       VARCHAR(255)  NOT NULL,
  company     VARCHAR(255)  NOT NULL,
  description TEXT          NULL,
  location    VARCHAR(255)  NULL,
  status      ENUM('open','closed') NOT NULL DEFAULT 'open',
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_job_postings_user FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;
