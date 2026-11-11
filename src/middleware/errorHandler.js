// 5xx Guardian — the terminal Express error handler. Every error thrown or
// forwarded by a controller lands here (Express 5 forwards rejected promises
// automatically). It writes the error to logs/error.logs, then answers with
// JSON for API clients and the error page for browsers. Stack traces are only
// exposed outside production.

const { writeErrorLog } = require('./errorLog');

function wantsJson(req) {
  if (req.path === '/api' || req.path.startsWith('/api/')) {
    return true;
  }
  return req.accepts(['html', 'json']) === 'json';
}

function statusOf(err) {
  const status = Number(err && (err.status || err.statusCode));
  return Number.isInteger(status) && status >= 400 && status <= 599 ? status : 500;
}

function reasonOf(err, status) {
  if (err && err.type === 'entity.parse.failed') {
    return 'Request body is not valid JSON.';
  }
  // Never leak internal messages (SQL errors, stack details) in production.
  if (status >= 500 && process.env.NODE_ENV === 'production') {
    return 'Unexpected server error.';
  }
  if (err && err.message) {
    return err.message;
  }
  return status >= 500 ? 'Unexpected server error.' : 'Request could not be processed.';
}

// eslint-disable-next-line no-unused-vars -- Express identifies error handlers by arity
function errorHandler(err, req, res, next) {
  const status = statusOf(err);
  const reason = reasonOf(err, status);
  const durationMs = req._startedAt ? Number(process.hrtime.bigint() - req._startedAt) / 1e6 : 0;

  writeErrorLog({
    status,
    method: req.method,
    route: req.originalUrl,
    durationMs,
    error: err,
  });

  if (res.headersSent) {
    return next(err);
  }

  if (wantsJson(req)) {
    const body = {
      error: status >= 500 ? 'Internal Server Error' : 'Bad Request',
      reason,
      method: req.method,
      path: req.originalUrl,
    };
    if (status >= 500 && process.env.NODE_ENV !== 'production' && err && err.stack) {
      body.stack = err.stack;
    }
    return res.status(status).json(body);
  }

  res.status(status).render('error', {
    title: status >= 500 ? 'Server error' : 'Request error',
    message: reason,
  });
}

module.exports = errorHandler;
