// Password hashing — scrypt from the Node standard library, so no dependency is
// added for it. A stored value looks like `scrypt$<salt hex>$<hash hex>`; the
// scheme prefix leaves room for a future algorithm change.
//
// Only hashing lives here for now: there is no sign-in yet, so nothing verifies
// a password. Verification belongs next to the login route when it is written.

const crypto = require('crypto');

const SCHEME = 'scrypt';
const KEY_LENGTH = 64;
const SALT_BYTES = 16;

function hashPassword(plain) {
  const salt = crypto.randomBytes(SALT_BYTES).toString('hex');
  const hash = crypto.scryptSync(plain, salt, KEY_LENGTH).toString('hex');
  return `${SCHEME}$${salt}$${hash}`;
}

module.exports = { hashPassword };
