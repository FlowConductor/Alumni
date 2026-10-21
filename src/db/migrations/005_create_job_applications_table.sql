-- Creates the job_applications table (Job Application entity, Career Services
-- context; see ddd.md). One application per user per posting (UNIQUE).

CREATE TABLE IF NOT EXISTS job_applications (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  job_posting_id BIGINT UNSIGNED NOT NULL,
  user_id        BIGINT UNSIGNED NOT NULL,
  status         ENUM('pending','reviewed','accepted','rejected') NOT NULL DEFAULT 'pending',
  cover_letter   TEXT      NULL,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_job_applications_posting FOREIGN KEY (job_posting_id) REFERENCES job_postings(id),
  CONSTRAINT fk_job_applications_user    FOREIGN KEY (user_id)        REFERENCES users(id),
  CONSTRAINT uq_job_application UNIQUE (job_posting_id, user_id)
) ENGINE=InnoDB;
