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

function get(id) {
  return load().find((u) => u.id === id) || null;
}

function add({ username, email }) {
  const users = load();
  const nextId = users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
  const created = { id: nextId, username, email };
  users.push(created);
  save(users);
  return created;
}

function update(id, fields) {
  const users = load();
  const user = users.find((u) => u.id === id);
  if (!user) return null;

  if (fields.username !== undefined) user.username = fields.username;
  if (fields.email !== undefined) user.email = fields.email;

  save(users);
  return user;
}

function remove(id) {
  const users = load();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  const [removed] = users.splice(index, 1);
  save(users);
  return removed;
}

module.exports = { list: load, get, add, update, remove };
