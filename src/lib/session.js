// Session configuration — one place for the cookie name, the secret, and the
// cookie flags, shared by server.js (which mounts the middleware) and the Auth
// controller (which clears the cookie on sign-out).
//
// MemoryStore is fine for a single department instance: sessions do not survive a
// restart, which is acceptable while there is no sign-in enforcement. A shared
// store (Redis, MySQL) becomes necessary the moment more than one app instance or
// a restart-tolerant session is required.

const session = require('express-session');

const COOKIE_NAME = 'mis.sid';
const EIGHT_HOURS = 1000 * 60 * 60 * 8;
const DEVELOPMENT_SECRET = 'mis-alumni-portal-development-secret';

function sessionMiddleware() {
  if (!process.env.SESSION_SECRET && process.env.NODE_ENV === 'production') {
    console.warn(
      'SESSION_SECRET is not set: falling back to the development secret. Set it before exposing the portal.'
    );
  }

  return session({
    name: COOKIE_NAME,
    secret: process.env.SESSION_SECRET || DEVELOPMENT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: EIGHT_HOURS,
    },
  });
}

module.exports = { sessionMiddleware, COOKIE_NAME };
