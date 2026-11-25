// HTTP helpers shared by the middleware layer — one definition of "does this
// client want JSON?", so a page and its API twin always answer in the same shape.

// JSON clients are anything under /api plus an explicit JSON accept header.
// A browser navigating to a page keeps getting HTML.
//
// Uses originalUrl, not path: inside a mounted router req.path is relative to the
// mount point, so /api/users would look like "/" to a guard attached there.
function wantsJson(req) {
  const url = req.originalUrl || req.path || '';
  if (url === '/api' || url.startsWith('/api/')) {
    return true;
  }
  return req.accepts(['html', 'json']) === 'json';
}

// Only same-site absolute paths are acceptable as a post-login destination:
// "//evil.example" and "https://evil.example" are rejected, which keeps the
// ?next= parameter from becoming an open redirect.
function safeNext(value) {
  const next = String(value || '');
  if (!next.startsWith('/') || next.startsWith('//')) {
    return null;
  }
  return next;
}

module.exports = { wantsJson, safeNext };
