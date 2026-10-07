// User Model — MVC model layer for users.
// File-backed (data/users.json): no database required, data survives restarts.
// Will be replaced by the MySQL data layer once the database is set up.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

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

// CREATE
function create({ username, email }) {
  const users = load();
  const id = users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
  const user = { id, username, email };
  users.push(user);
  save(users);
  return user;
}

// READ
function findAll() {
  return load();
}

function findById(id) {
  return load().find((u) => u.id === id) || null;
}

// UPDATE
function update(id, fields) {
  const users = load();
  const user = users.find((u) => u.id === id);
  if (!user) return null;

  if (fields.username !== undefined) user.username = fields.username;
  if (fields.email !== undefined) user.email = fields.email;

  save(users);
  return user;
}

// DELETE
function remove(id) {
  const users = load();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  const [removed] = users.splice(index, 1);
  save(users);
  return removed;
}

module.exports = { create, findAll, findById, update, remove };
