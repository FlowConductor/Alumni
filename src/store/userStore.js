const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// File-backed store: no database required, data survives restarts.
// Will be replaced by the MySQL data layer once the database is set up.

function load() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

function save(users) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function add({ username, email }) {
  const users = load();
  const nextId = users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
  const created = { id: nextId, username, email };
  users.push(created);
  save(users);
  return created;
}

module.exports = { add };
