// Auth middleware — enforces the role matrix documented in ddd.md section 8.
//
// Two guards, both answering in the shape the client expects:
//   requireAuth           any signed-in user
//   requireRole(...roles) a signed-in user whose role is in the list
//
// Browsers are redirected to the sign-in page (GET only) or shown the error page;
// JSON clients get 401 / 403 with the same { error, reason, method, path } body
// the guardians use. The role is read from the session, never from the request
// body, so a caller cannot claim a role.

const { wantsJson } = require('../lib/http');

const ROLE_LABELS = {
  alumni: 'alumni',
  employer: 'employer',
  staff: 'department staff',
  admin: 'administrator',
};

function currentUser(req) {
  return (req.session && req.session.user) || null;
}

function unauthenticated(req, res) {
  if (wantsJson(req)) {
    return res.status(401).json({
      error: 'Authentication required',
      reason: `Sign in to use ${req.method} ${req.originalUrl}.`,
      method: req.method,
      path: req.originalUrl,
    });
  }

  // A POST cannot be replayed after a redirect, so only GET keeps its target.
  if (req.method === 'GET') {
    return res.redirect(`/login?next=${encodeURIComponent(req.originalUrl)}`);
  }

  return res.redirect('/login');
}

function forbidden(req, res, roles) {
  const needed = roles.map((role) => ROLE_LABELS[role] || role).join(' or ');
  const reason = `This action is limited to ${needed}.`;

  if (wantsJson(req)) {
    return res.status(403).json({
      error: 'Not permitted',
      reason,
      method: req.method,
      path: req.originalUrl,
    });
  }

  return res.status(403).render('error', { title: 'Not permitted', message: reason });
}

function requireAuth(req, res, next) {
  if (currentUser(req)) {
    return next();
  }
  return unauthenticated(req, res);
}

function requireRole(...roles) {
  return function roleGuard(req, res, next) {
    const user = currentUser(req);
    if (!user) {
      return unauthenticated(req, res);
    }
    if (!roles.includes(user.role)) {
      return forbidden(req, res, roles);
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole, currentUser };
