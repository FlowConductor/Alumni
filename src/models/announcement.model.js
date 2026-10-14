// Announcement Model — MVC model layer for announcements, backed by the
// MySQL `announcements` table (see src/db/migrations/003_create_announcements_table.sql).

const db = require('../db/database');

const SELECT = 'SELECT id, title, content, created_at FROM announcements';

function toAnnouncement(row) {
  return { id: row.id, title: row.title, content: row.content, createdAt: row.created_at };
}

// CREATE
async function create({ title, content }) {
  const [result] = await db.query(
    'INSERT INTO announcements (title, content) VALUES (?, ?)',
    [title, content]
  );
  const [rows] = await db.query(`${SELECT} WHERE id = ?`, [result.insertId]);
  return toAnnouncement(rows[0]);
}

// READ
async function findAll() {
  const [rows] = await db.query(`${SELECT} ORDER BY id`);
  return rows.map(toAnnouncement);
}

async function findById(id) {
  const [rows] = await db.query(`${SELECT} WHERE id = ?`, [id]);
  return rows[0] ? toAnnouncement(rows[0]) : null;
}

// UPDATE
async function update(id, fields) {
  const sets = [];
  const values = [];

  if (fields.title !== undefined) {
    sets.push('title = ?');
    values.push(fields.title);
  }
  if (fields.content !== undefined) {
    sets.push('content = ?');
    values.push(fields.content);
  }

  if (sets.length === 0) {
    return findById(id);
  }

  values.push(id);
  const [result] = await db.query(`UPDATE announcements SET ${sets.join(', ')} WHERE id = ?`, values);
  if (result.affectedRows === 0) {
    return null;
  }

  return findById(id);
}

// DELETE
async function remove(id) {
  const announcement = await findById(id);
  if (!announcement) {
    return null;
  }

  await db.query('DELETE FROM announcements WHERE id = ?', [id]);
  return announcement;
}

module.exports = { create, findAll, findById, update, remove };
