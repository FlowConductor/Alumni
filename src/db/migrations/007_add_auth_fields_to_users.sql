-- Adds the authentication and role fields to users (see ddd.md sections 3, 4 and 8).
--
-- password_hash is nullable on purpose: the users seeded before this migration
-- have no password, so they cannot sign in until one is set. New accounts created
-- through the register form always store a hash.
-- role defaults to 'alumni': self-service registration never chooses a role.

ALTER TABLE users
  ADD COLUMN password_hash VARCHAR(255) NULL AFTER email,
  ADD COLUMN role ENUM('alumni','employer','staff','admin') NOT NULL DEFAULT 'alumni' AFTER password_hash;
