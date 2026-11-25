// Auth Controller — sign in, sign out, and self-service registration.
//
// Sessions are cookie based (express-session, see server.js). The session holds
// only what the interface needs to render: id, username, role. The password hash
// never enters the session, a view, or a log line.
//
// Sign-in does not yet guard any route: every page is still reachable without a
// session. Enforcing the role matrix in ddd.md section 8 is the next step, and it
// belongs in a requireRole middleware rather than in each controller.

const UserModel = require('../models/user.model');
const { hashPassword, verifyPassword } = require('../lib/password');
const { COOKIE_NAME } = require('../lib/session');

const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,100}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 200;

// Checked against every unknown email so a missing account and a wrong password
// take the same time and answer the same way. Generated once at startup.
const DUMMY_HASH = hashPassword('no-such-account-placeholder');

const SESSION_USER = 'user';

/* ---------------------------------------------------------------- register */

function validateRegistration({ username, email, password, passwordConfirm }) {
  const errors = [];

  if (!username) {
    errors.push('Field "username" is required.');
  } else if (!USERNAME_PATTERN.test(username)) {
    errors.push(
      'Field "username" must be 3 to 100 characters: letters, digits, dot, underscore, or hyphen.'
    );
  }

  if (!email) {
    errors.push('Field "email" is required.');
  } else if (email.length > 255 || !EMAIL_PATTERN.test(email)) {
    errors.push('Field "email" must be a valid email address.');
  }

  if (!password) {
    errors.push('Field "password" is required.');
  } else if (password.length < PASSWORD_MIN) {
    errors.push(`Field "password" must be at least ${PASSWORD_MIN} characters.`);
  } else if (password.length > PASSWORD_MAX) {
    errors.push(`Field "password" must be at most ${PASSWORD_MAX} characters.`);
  } else if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    errors.push('Field "password" must contain at least one letter and one digit.');
  }

  if (password !== passwordConfirm) {
    errors.push('Field "password_confirm" must match the password.');
  }

  return errors;
}

// GET /register — view: src/views/auth/register.ejs
function registerForm(req, res) {
  if (req.session[SESSION_USER]) {
    return res.redirect('/users');
  }
  return res.render('auth/register', { errors: [], values: { username: '', email: '' } });
}

// POST /register
async function register(req, res) {
  const body = req.body || {};
  const username = (body.username || '').trim();
  const email = (body.email || '').trim();
  const password = body.password || '';
  const passwordConfirm = body.password_confirm || '';
  const values = { username, email };

  const errors = validateRegistration({ username, email, password, passwordConfirm });
  if (errors.length > 0) {
    return res.status(400).render('auth/register', { errors, values });
  }

  try {
    const user = await UserModel.create({
      username,
      email,
      password_hash: hashPassword(password),
      role: 'alumni',
    });

    return res.redirect(`/users?registered=${encodeURIComponent(user.username)}`);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).render('auth/register', {
        errors: ['That username or email is already registered.'],
        values,
      });
    }
    throw err;
  }
}

/* ------------------------------------------------------------------- login */

// GET /login — view: src/views/auth/login.ejs
function loginForm(req, res) {
  if (req.session[SESSION_USER]) {
    return res.redirect('/users');
  }
  return res.render('auth/login', { errors: [], values: { email: '' } });
}

function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => (err ? reject(err) : resolve()));
  });
}

function saveSession(req) {
  return new Promise((resolve, reject) => {
    req.session.save((err) => (err ? reject(err) : resolve()));
  });
}

// POST /login
async function login(req, res) {
  // Express 5 leaves req.body undefined when the request carries no body, so a
  // body-less POST is a validation failure, not a crash.
  const body = req.body || {};
  const email = (body.email || '').trim();
  const password = body.password || '';
  const values = { email };

  const errors = [];
  if (!email) errors.push('Field "email" is required.');
  if (!password) errors.push('Field "password" is required.');
  if (errors.length > 0) {
    return res.status(400).render('auth/login', { errors, values });
  }

  const credentials = await UserModel.findCredentials(email);
  const stored = credentials && credentials.password_hash ? credentials.password_hash : DUMMY_HASH;
  const valid = verifyPassword(password, stored);

  if (!valid || !credentials || !credentials.password_hash) {
    // One message for both cases: a valid email with the wrong password and an
    // unknown email must not be distinguishable from the outside.
    return res.status(401).render('auth/login', {
      errors: ['Email or password is incorrect.'],
      values,
    });
  }

  // A fresh session id on every sign-in prevents session fixation.
  await regenerateSession(req);
  req.session[SESSION_USER] = {
    id: credentials.id,
    username: credentials.username,
    role: credentials.role,
  };
  await saveSession(req);

  return res.redirect('/users');
}

/* ------------------------------------------------------------------ logout */

// POST /logout
function logout(req, res, next) {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie(COOKIE_NAME);
    return res.redirect('/');
  });
}

module.exports = { registerForm, register, loginForm, login, logout };
