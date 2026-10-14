# DDD — MIS Alumni Portal (Basic Domain Design)

Status: implemented. The `users` and `donate` tables exist in MySQL (migrations 001 and 002 in `src/db/migrations/`), and the User model is backed by the `users` table. Donation endpoints are not implemented yet.

## 1. Ubiquitous Language

| Term | Meaning |
|------|---------|
| **User** | Anyone with an account on the portal (alumni or staff) |
| **Donation** | A single act of giving money to the department or a campaign |
| **Donor** | A User who has made at least one Donation |
| **Campaign** | A named fundraising effort (e.g., "Scholarship Fund") a Donation can target |
| **Announcement** | A notice published to the alumni community (already implemented; out of scope here) |

## 2. Bounded Contexts

- **User Management** — registration, profiles, and account data. Owns the `users` table.
- **Fundraising** — donations and campaigns. Owns the `donate` table. References users only by `user_id`.

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

## 5. Relationships

```
users (1) ────< donate (N)
   one user makes many donations; each donation has exactly one donor
```

- `donate.user_id` → `users.id` (foreign key).
- Deleting a user: donations are kept for financial records (**restrict**), so the FK prevents deleting a user who still has donations.

## 6. Future Considerations (TBD)

- Passwords/authentication on `users` (e.g., a `password_hash` column) — not decided yet.
- A separate `campaigns` table once the Fundraising module is implemented.
- Donation receipt/payment integration (status flow: pending → completed/failed).
