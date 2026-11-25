// Password hashing and verification — scrypt from the Node standard library, so
// no dependency is added for it. A stored value looks like
// `scrypt$<salt hex>$<hash hex>`; the scheme prefix leaves room for a future
// algorithm change.
//
// The hash is produced by the register flow and checked by the sign-in flow.
// Nothing else may read it: the User model never selects password_hash except
// in the single auth lookup.

const crypto = require('crypto');

const SCHEME = 'scrypt';
const KEY_LENGTH = 64;
const SALT_BYTES = 16;

function hashPassword(plain) {
  const salt = crypto.randomBytes(SALT_BYTES).toString('hex');
  const hash = crypto.scryptSync(plain, salt, KEY_LENGTH).toString('hex');
  return `${SCHEME}$${salt}$${hash}`;
}

function verifyPassword(plain, stored) {
  const [scheme, salt, hash] = String(stored || '').split('$');
  if (scheme !== SCHEME || !salt || !hash) {
    return false;
  }

  const expected = Buffer.from(hash, 'hex');
  const candidate = crypto.scryptSync(plain, salt, expected.length);
  return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected);
}

module.exports = { hashPassword, verifyPassword };
