// Announcement Model — MVC model layer for announcements.
// File-backed (data/announcements.json): no database required, data survives restarts.
// Will be replaced by the MySQL data layer once the database is set up.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const ANNOUNCEMENTS_FILE = path.join(DATA_DIR, 'announcements.json');

function load() {
  try {
    return JSON.parse(fs.readFileSync(ANNOUNCEMENTS_FILE, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

function save(announcements) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(ANNOUNCEMENTS_FILE, JSON.stringify(announcements, null, 2));
}

// CREATE
function create({ title, content }) {
  const announcements = load();
  const id = announcements.reduce((max, a) => Math.max(max, a.id), 0) + 1;
  const announcement = { id, title, content, createdAt: new Date().toISOString() };
  announcements.push(announcement);
  save(announcements);
  return announcement;
}

// READ
function findAll() {
  return load();
}

function findById(id) {
  return load().find((a) => a.id === id) || null;
}

// UPDATE
function update(id, fields) {
  const announcements = load();
  const announcement = announcements.find((a) => a.id === id);
  if (!announcement) return null;

  if (fields.title !== undefined) announcement.title = fields.title;
  if (fields.content !== undefined) announcement.content = fields.content;

  save(announcements);
  return announcement;
}

// DELETE
function remove(id) {
  const announcements = load();
  const index = announcements.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const [removed] = announcements.splice(index, 1);
  save(announcements);
  return removed;
}

module.exports = { create, findAll, findById, update, remove };
