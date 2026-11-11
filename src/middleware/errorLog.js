// Error log writer — appends one line per server-side error to logs/error.logs.
// The directory is created on first write, so a fresh clone needs no setup.
// Line format:
//   2025-01-01T10:20:30.000Z 500 GET /api/users 18ms Error: connect ECONNREFUSED
// followed by the stack trace on the following lines.

const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '..', '..', 'logs');
const ERROR_LOG_FILE = path.join(LOG_DIR, 'error.logs');

function writeErrorLog({ status, method, route, durationMs, error }) {
  const timestamp = new Date().toISOString();
  const message = error && error.message ? error.message : String(error);
  const stack = error && error.stack ? `\n${error.stack}` : '';
  const line = `${timestamp} ${status} ${method} ${route} ${Math.round(durationMs)}ms ${message}${stack}\n`;

  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
    fs.appendFileSync(ERROR_LOG_FILE, line, 'utf8');
  } catch (writeErr) {
    // Logging must never take the request down.
    console.error(`Could not write to ${ERROR_LOG_FILE}: ${writeErr.message}`);
  }
}

module.exports = { writeErrorLog, ERROR_LOG_FILE };
