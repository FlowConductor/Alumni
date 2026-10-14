-- Creates the donate table (Donation entity, see ddd.md)

CREATE TABLE IF NOT EXISTS donate (
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
