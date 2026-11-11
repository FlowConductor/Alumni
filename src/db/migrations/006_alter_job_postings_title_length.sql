-- Narrows job_postings.title to the documented validation rule
-- (title required, max 120 characters; see ddd.md section 3 and 7).

ALTER TABLE job_postings
  MODIFY title VARCHAR(120) NOT NULL;
