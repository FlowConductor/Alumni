// 404 Guardian — the last middleware before the error handler. Any request that
// reaches it matched no route, so it answers with a 404 and an explicit reason.
// JSON clients (anything under /api, or an explicit JSON Accept header) get a
// JSON body; browsers get the generic 404 page (src/views/404.ejs).

function wantsJson(req) {
  if (req.path === '/api' || req.path.startsWith('/api/')) {
    return true;
  }
  return req.accepts(['html', 'json']) === 'json';
}

function notFoundHandler(req, res) {
  const reason = `No route matches ${req.method} ${req.originalUrl}.`;

  if (wantsJson(req)) {
    return res.status(404).json({
      error: 'Not Found',
      reason,
      method: req.method,
      path: req.originalUrl,
    });
  }

  res.status(404).render('404', {
    method: req.method,
    path: req.originalUrl,
    reason,
  });
}

module.exports = notFoundHandler;
