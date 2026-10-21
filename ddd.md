# DDD — MIS Alumni Portal (Basic Domain Design)

Status: implemented. The `users`, `donate`, `announcements`, `job_postings`, and `job_applications` tables exist in MySQL (migrations 001–005 in `src/db/migrations/`). All five models are backed by their tables; Donation, Job Posting, and Job Application endpoints are implemented (JSON API, direct and nested routes).

## 1. Ubiquitous Language

| Term | Meaning |
|------|---------|
| **User** | Anyone with an account on the portal (alumni or staff) |
| **Donation** | A single act of giving money to the department or a campaign |
| **Donor** | A User who has made at least one Donation |
| **Campaign** | A named fundraising effort (e.g., "Scholarship Fund") a Donation can target |
| **Announcement** | A notice published to the alumni community (implemented; see migration 003) |
| **Job Posting** | A job opportunity published to the MIS community by an alumnus or a partner company |
| **Job Application** | A User's application to a Job Posting |

## 2. Bounded Contexts

- **User Management** — registration, profiles, and account data. Owns the `users` table.
- **Fundraising** — donations and campaigns. Owns the `donate` table. References users only by `user_id`.
- **Career Services** — job postings and applications targeting the MIS community. Owns the `job_postings` and `job_applications` tables. References users by `posted_by` / `user_id`.

## 3. Entities and Aggregates

### User (aggregate root, User Management context)

- Identity: `id`.
- Attributes: `username`, `email`, `created_at`, `updated_at`.
- Invariants: `username` is required and unique; `email` is required, unique, and a valid address.
- Current reference implementation: `src/models/user.model.js`.

### Donation (entity, Fundraising context)

- Identity: `id`.
- Attributes: `user_id` (donor), `amount`, `currency`, `campaign` (optional), `status`, `donated_at`.
- Invariants: `amount` must be greater than zero; `user_id` must reference an existing user.
- A User can have many Donations; a Donation belongs to exactly one User.
- Current reference implementation: `src/models/donation.model.js` (JOIN on `users` for the donor, `findByUser` accessor).

### Job Posting (entity, Career Services context)

- Identity: `id`.
- Attributes: `posted_by` (optional, the User who posted it), `title`, `company`, `description` (optional), `location` (optional), `status`, `created_at`.
- Invariants: `title` and `company` are required; new postings start as `open`.
- `posted_by` may be null: partner companies can post without a portal account. A User can post many Job Postings.
- Current reference implementation: `src/models/jobPosting.model.js` (LEFT JOIN on `users` for the poster, `findByUser` accessor).

### Job Application (entity, Career Services context)

- Identity: `id`.
- Attributes: `job_posting_id`, `user_id` (applicant), `status`, `cover_letter` (optional), `created_at`.
- Invariants: `job_posting_id` and `user_id` are required; a User can apply to a given Job Posting at most once (unique constraint); new applications start as `pending`.
- A User can have many Job Applications; a Job Posting can have many Job Applications; each Job Application belongs to exactly one User and one Job Posting.
- Current reference implementation: `src/models/application.model.js` (JOIN on `users` and `job_postings`, `findByUser` and `findByJobPosting` accessors).

## 4. Data Model (MySQL)

### users table

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| username | VARCHAR(100) | NOT NULL, UNIQUE |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

```sql
CREATE TABLE users (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(100)  NOT NULL UNIQUE,
  email      VARCHAR(255)  NOT NULL UNIQUE,
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
```

### donate table

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| user_id | BIGINT UNSIGNED | NOT NULL, FK → users.id |
| amount | DECIMAL(10,2) | NOT NULL, CHECK (amount > 0) |
| currency | CHAR(3) | NOT NULL, DEFAULT 'TRY' |
| campaign | VARCHAR(255) | NULL (donation without a specific campaign) |
| status | ENUM('pending','completed','failed') | NOT NULL, DEFAULT 'pending' |
| donated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

```sql
CREATE TABLE donate (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT UNSIGNED NOT NULL,
  amount     DECIMAL(10,2)   NOT NULL,
  currency   CHAR(3)         NOT NULL DEFAULT 'TRY',
  campaign   VARCHAR(255)    NULL,
  status     ENUM('pending','completed','failed') NOT NULL DEFAULT 'pending',
  donated_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_donate_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT chk_donate_amount CHECK (amount > 0)
) ENGINE=InnoDB;
```

### job_postings table

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| posted_by | BIGINT UNSIGNED | NULL, FK → users.id (ON DELETE SET NULL) |
| title | VARCHAR(255) | NOT NULL |
| company | VARCHAR(255) | NOT NULL |
| description | TEXT | NULL |
| location | VARCHAR(255) | NULL |
| status | ENUM('open','closed') | NOT NULL, DEFAULT 'open' |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

```sql
CREATE TABLE job_postings (
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
```

### job_applications table

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| job_posting_id | BIGINT UNSIGNED | NOT NULL, FK → job_postings.id |
| user_id | BIGINT UNSIGNED | NOT NULL, FK → users.id |
| status | ENUM('pending','reviewed','accepted','rejected') | NOT NULL, DEFAULT 'pending' |
| cover_letter | TEXT | NULL |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| (job_posting_id, user_id) | | UNIQUE |

```sql
CREATE TABLE job_applications (
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
```

## 5. Relationships

```
users (1) ────< donate (N)
   one user makes many donations; each donation has exactly one donor
```

- `donate.user_id` → `users.id` (foreign key).
- Deleting a user: donations are kept for financial records (**restrict**), so the FK prevents deleting a user who still has donations.

```
users (1) ────< job_postings (N)
   a user can post many job postings; a posting survives the deletion of its poster
```

- `job_postings.posted_by` → `users.id` (nullable foreign key, **ON DELETE SET NULL**): deleting the posting user keeps the posting with `posted_by = NULL`.
- Job postings can also exist without a user from the start (partner company postings).

```
users (1) ────< job_applications (N) >──── (1) job_postings
   a user can apply to many postings; a posting receives many applications
```

- `job_applications.user_id` → `users.id` and `job_applications.job_posting_id` → `job_postings.id` (both NOT NULL, **restrict**): a user or a posting cannot be deleted while applications exist.
- `(job_posting_id, user_id)` is UNIQUE: one application per user per posting.

## 6. Future Considerations (TBD)

- Passwords/authentication on `users` (e.g., a `password_hash` column) — not decided yet.
- A separate `campaigns` table once the Fundraising module is implemented.
- Donation receipt/payment integration (status flow: pending → completed/failed).
- Application status flow (pending → reviewed → accepted/rejected) and notifications.
