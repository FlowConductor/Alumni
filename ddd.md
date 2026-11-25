# DDD — MIS Alumni Portal (Basic Domain Design)

Status: implemented. The `users`, `donate`, `announcements`, `job_postings`, and `job_applications` tables exist in MySQL (migrations 001–006 in `src/db/migrations/`). All five models are backed by their tables; Donation, Job Posting, and Job Application endpoints are implemented (JSON API, direct and nested routes). Validation rules are listed in section 7. `password_hash` and `role` were added by migration 007 and the self-service register flow fills both; sign-in and role enforcement are still **not implemented** (section 8).

## 1. Ubiquitous Language

| Term | Meaning |
|------|---------|
| **User** | Anyone with an account on the portal: an alumnus, a partner-company contact, or department staff. Every User has exactly one Role (section 8) |
| **Role** | The single capacity in which a User acts: `alumni`, `employer`, `staff`, or `admin`. Designed, not yet implemented |
| **Alumni** | A graduate of the department. The default Role for a new account |
| **Employer** | A partner-company contact who publishes opportunities. Has no profile in the alumni directory |
| **Department staff** | Department employees who maintain the directory and publish content |
| **Administrator** | The account allowed to assign Roles and delete Users |
| **Guest** | An unauthenticated visitor. Today every visitor is a Guest and every route is open |
| **Donation** | A single act of giving money to the department or a campaign |
| **Donor** | A User who has made at least one Donation. Derived from the records, not a Role |
| **Campaign** | A named fundraising effort (e.g., "Scholarship Fund") a Donation can target |
| **Announcement** | A notice published to the alumni community (implemented; see migration 003) |
| **Job Posting** | A job opportunity published to the MIS community by an alumnus or a partner company |
| **Job Application** | A User's application to a Job Posting |

## 2. Bounded Contexts

- **User Management** — registration, profiles, account data, and **roles**. Owns the `users` table and is the only context allowed to change a Role. The other contexts reference a Role only to decide whether an action is permitted (section 8).
- **Fundraising** — donations and campaigns. Owns the `donate` table. References users only by `user_id`.
- **Career Services** — job postings and applications targeting the MIS community. Owns the `job_postings` and `job_applications` tables. References users by `posted_by` / `user_id`.

## 3. Entities and Aggregates

### User (aggregate root, User Management context)

- Identity: `id`.
- Attributes: `username`, `email`, `password_hash` (never exposed), `role`, `created_at`, `updated_at`.
- Invariants: `username` is required and unique; `email` is required, unique, and a valid address; `role` is one of `alumni`, `employer`, `staff`, `admin` and defaults to `alumni`; a password is stored only as an scrypt hash.
- A User always has exactly one Role. Roles are described in section 8.
- Current reference implementation: `src/models/user.model.js` reads `id`, `username`, `email`, and `role` and never selects `password_hash`; `src/lib/password.js` produces the hash; `src/controllers/auth.controller.js` owns the register flow.

### Donation (entity, Fundraising context)

- Identity: `id`.
- Attributes: `user_id` (donor), `amount`, `currency`, `campaign` (optional), `status`, `donated_at`.
- Invariants: `amount` must be greater than zero; `user_id` must reference an existing user.
- A User can have many Donations; a Donation belongs to exactly one User.
- Current reference implementation: `src/models/donation.model.js` (JOIN on `users` for the donor, `findByUser` accessor).

### Job Posting (entity, Career Services context)

- Identity: `id`.
- Attributes: `posted_by` (optional, the User who posted it), `title`, `company`, `description` (optional), `location` (optional, the city), `status`, `created_at`.
- Invariants: `title` is required and at most 120 characters; `company` is required; `location` (city) and `description` are optional; new postings start as `open`. See section 7 for the full rule set.
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

#### users.password_hash and users.role — applied by migration 007

| Column | Type | Constraints |
|--------|------|-------------|
| password_hash | VARCHAR(255) | NULL — nullable so pre-existing records survive; an account without a hash cannot sign in |
| role | ENUM('alumni','employer','staff','admin') | NOT NULL, DEFAULT 'alumni' |

```sql
-- src/db/migrations/007_add_auth_fields_to_users.sql
ALTER TABLE users
  ADD COLUMN password_hash VARCHAR(255) NULL AFTER email,
  ADD COLUMN role ENUM('alumni','employer','staff','admin') NOT NULL DEFAULT 'alumni' AFTER password_hash;
```

`password_hash` stores `scrypt$<salt>$<hash>` (see `src/lib/password.js`) and is never part of a model read. `role` is written only by the register flow, which always writes `'alumni'`; the API does not accept a role in its request body. No code path reads the Role yet — the column exists, the enforcement does not.

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
| title | VARCHAR(120) | NOT NULL (required, max 120 characters) |
| company | VARCHAR(255) | NOT NULL |
| description | TEXT | NULL |
| location | VARCHAR(255) | NULL (the city; optional) |
| status | ENUM('open','closed') | NOT NULL, DEFAULT 'open' |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

```sql
CREATE TABLE job_postings (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  posted_by   BIGINT UNSIGNED NULL,
  title       VARCHAR(120)  NOT NULL,
  company     VARCHAR(255)  NOT NULL,
  description TEXT          NULL,
  location    VARCHAR(255)  NULL,
  status      ENUM('open','closed') NOT NULL DEFAULT 'open',
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_job_postings_user FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;
```

Migration `006_alter_job_postings_title_length.sql` narrows `title` from `VARCHAR(255)` to `VARCHAR(120)` so the column matches the validation rule.

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

- Password reset and email verification: `password_hash` and sign-in exist, but there is no reset flow and no verification email.
- A shared session store: sessions live in the process memory (`MemoryStore`), so they vanish on restart and cannot be shared by two instances. Redis or a MySQL-backed store is needed before scaling out.
- Sign-in throttling: nothing slows down repeated failed attempts yet.
- Multi-role accounts: an alumnus who also works for the department currently collapses into `staff`. A `user_roles` join table is the escape hatch if the department needs both.
- Audit trail for role changes: who changed whose Role, and when.
- Role-aware UI: hide actions a Role cannot perform instead of only rejecting them server-side.
- A separate `campaigns` table once the Fundraising module is implemented.
- Donation receipt/payment integration (status flow: pending → completed/failed).
- Application status flow (pending → reviewed → accepted/rejected) and notifications.

## 7. Validation Rules

Rules are enforced in the controllers before the model is called, so an invalid request never reaches the database. The JSON API answers `400` with `{"error": "..."}`; the web UI re-renders the error page with the same message.

### Job Posting

| Field | Required | Rule | Violation |
|-------|----------|------|-----------|
| `title` | Yes | Non-empty string, at most **120 characters** | `400` — `Field "title" is required.` / `Field "title" must be at most 120 characters.` |
| `company` | Yes | Non-empty string | `400` — `Field "company" is required.` |
| `location` (city) | No | Free text; may be omitted or `null` | — |
| `description` | No | Free text; may be omitted or `null` | — |
| `posted_by` | No | Positive integer referencing an existing user | `400` if not a positive integer, `404` if the user does not exist |
| `status` | No | `open` or `closed`; defaults to `open` | `400` — `Field "status" must be one of: open, closed.` |

Enforced in `src/controllers/apiJobPosting.controller.js` (JSON API), `src/controllers/jobPosting.controller.js` (web), `src/views/jobPostings/create.ejs` and `edit.ejs` (`maxlength="120"`), `src/docs/openapi.js` (`maxLength: 120`), and the `job_postings.title` column (`VARCHAR(120)`, migration 006).

### User and Job Application (summary)

- **User** — `username` required and unique; `email` required, a valid address, and unique. Violations: `400` (missing/malformed) or `409` (duplicate).
- **Role** (section 8) — one of `alumni`, `employer`, `staff`, `admin`; defaults to `alumni`; only an `admin` may set it. Violations: `400` (unknown value) or `403` (not permitted).
- **Registration** (`POST /register`) — `username` 3–100 characters of letters, digits, dot, underscore, or hyphen; `email` a valid unique address; `password` at least 8 characters with at least one letter and one digit; `password_confirm` must match. Violations: `400` with every failing rule listed on the form, or `409` when the username or email is taken.
- **Job Application** — `job_posting_id` and `user_id` required and must reference existing rows; one application per user per posting. Violations: `400` (missing/invalid), `404` (unknown posting or user), `409` (duplicate application).
- **Deletion** — a User with donations or applications, and a Job Posting with applications, cannot be deleted: the foreign keys restrict it and the controllers answer `409`.

## 8. User Roles and Access Control

Status: **enforced on every route.** The `role` column exists (migration 007), registration always writes `alumni` with a scrypt password hash, sign-in and sign-out run on a server-side session, and `src/middleware/auth.js` (`requireAuth`, `requireRole(...roles)`) now applies the matrix below to all ten route files. The README section [Access Control (Route Guards)](README.md#access-control-route-guards) lists the guard mounted on every route and the exact `401`/`403` bodies. Two capability gaps remain and are noted under the implementation plan.

### The four roles

| Role | Who it is | What it is for |
|------|-----------|----------------|
| `alumni` | A graduate of the department. The default role of every new account. | Owns their profile, reads announcements, applies to job postings, records their own donations. |
| `employer` | A contact person at a partner company. | Publishes postings for that company and reads the applications to them. Has no profile in the alumni directory. |
| `staff` | Department staff: secretariat and career services. | Maintains the directory, publishes announcements, manages postings, records donations, reads reports. |
| `admin` | Department administrator or system owner. | Everything staff can do, plus assigning roles and deleting users. |

Three clarifications:

- **Donor is not a role.** It is derived: a User with at least one Donation. Storing it would duplicate the `donate` table.
- **Mentor is not a role.** It will be a relationship between two alumni when the mentorship module is built, not a capacity of the account.
- **A posting can exist without a User.** `job_postings.posted_by` is nullable, so a partner company with no portal account posts through `staff`; an `employer` account is only needed when that company manages its own postings.

### Capabilities by role

| Capability | `alumni` | `employer` | `staff` | `admin` |
|------------|----------|------------|---------|---------|
| Read the alumni directory | community-visible fields | — | all fields | all fields |
| Edit own profile | yes | — | yes | yes |
| Edit another user's record | — | — | yes | yes |
| Create a user | — | — | yes | yes |
| Delete a user | — | — | — | yes |
| Assign or change a role | — | — | — | yes |
| Read announcements | yes | yes | yes | yes |
| Publish or edit an announcement | — | — | yes | yes |
| Publish a job posting | — | own company only | any | any |
| Close or delete a posting | — | own postings | any | any |
| Apply to a posting | yes | — | — | — |
| Read applications to a posting | own applications | own postings | all | all |
| Change an application status | — | own postings | yes | yes |
| Record a donation | own | — | any user | any user |
| Read donation totals | own | — | yes | yes |
| Read accreditation analytics | — | — | yes | yes |

### Rules

- An account always has **exactly one** Role, and a new account always starts as `alumni`. There is no unprivileged or anonymous role inside the model: an unauthenticated visitor is a Guest (section 1) and gets read-only pages.
- Only an `admin` assigns or changes a Role. An account can never change its own Role, which removes self-elevation as an attack path.
- The last remaining `admin` cannot be demoted or deleted: the department must always keep one administrator.
- Role checks belong in the middleware layer, before the controller and therefore before the model is called, and behave identically on the HTML and JSON surfaces — a role that is refused on a page is refused on the API. Middleware rather than controller code keeps the check impossible to forget when a new route is added.
- A refusal is `403` with the same `{ error, reason, method, path }` shape as the other failures, so the 5xx Guardian and the clients need no special case.
- Deletion stays platform-wide `admin`-only, consistent with the foreign-key restrictions in section 5: donations and applications already prevent most accidental deletions.

### Implementation plan (TBD)

1. ~~Migration adding the `role` column (section 4)~~ — done: `007_add_auth_fields_to_users.sql`, `NOT NULL DEFAULT 'alumni'`.
2. ~~Extend the User model to select and map `role`~~ — done for reads; writing a Role is still admin-only work that waits for step 4.
3. ~~Add session authentication on top of `password_hash`~~ — done: `POST /login` starts a session (crypto-signed cookie, eight hours, `HttpOnly`, `SameSite=Lax`), `POST /logout` destroys it, and the session carries only `id`, `username`, `role`.
4. ~~Add a `requireRole(...roles)` middleware next to the logger and the guardians, then apply it to the write routes (`POST`, `PUT`, `PATCH`, `DELETE`)~~ — done: `src/middleware/auth.js` exports `requireAuth`, `requireRole(...roles)`, and `currentUser`, and every route file mounts a guard. Reads of the directory and of `/api/users` need a session; writes need `staff` or `admin`; deleting a user needs `admin`; applying to a posting needs `alumni`. Pages answer `302 /login?next=…` or a `403` page, the API answers `401`/`403` JSON.
5. ~~Add a role selector (admin only) to the web views, and a writable `role` field to the `UserInput` schema in `src/docs/openapi.js`~~ — done: `/admin/users` carries a selector per row, `POST /admin/users/:id/role` and `PATCH /api/users/:id` with `role` both accept the four roles, and the rules below (no self-change, last administrator protected) live in `src/controllers/admin.controller.js` and its API twin. The panel itself is documented in the README section Admin Panel.
6. Close two enforcement gaps that the current data model cannot express: job postings have no company owner column, so `employer` writes stay refused even though the matrix allows "own company only"; and `POST /api/applications` accepts any `user_id`, so an alumnus can apply on someone else's behalf instead of only for themselves.
