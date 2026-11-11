// Request logger middleware — prints one line per request to the terminal.
// Line format: 10:20:30 POST /api/users 201 18ms
//   time      local wall-clock time the request finished (HH:MM:SS)
//   method    HTTP method
//   route     the requested path (query string included)
//   status    the response status code
//   duration  time between receiving the request and finishing the response

function timeOfDay(date = new Date()) {
  return date.toTimeString().slice(0, 8);
}

function requestLogger(req, res, next) {
  const startedAt = process.hrtime.bigint();
  // Shared with the 5xx Guardian so error log lines carry the same duration.
  req._startedAt = startedAt;

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    console.log(
      `${timeOfDay()} ${req.method} ${req.originalUrl} ${res.statusCode} ${Math.round(durationMs)}ms`
    );
  });

  next();
}

module.exports = requestLogger;
