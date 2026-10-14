// User Model — MVC model layer for users, backed by the MySQL `users` table
// (see ddd.md and src/db/migrations/001_create_users_table.sql).

const db = require('../db/database');

const SELECT = 'SELECT id, username, email FROM users';

// CREATE
async function create({ username, email }) {
  const [result] = await db.query(
    'INSERT INTO users (username, email) VALUES (?, ?)',
    [username, email]
  );
  const [rows] = await db.query(`${SELECT} WHERE id = ?`, [result.insertId]);
  return rows[0];
}

// READ
async function findAll() {
  const [rows] = await db.query(`${SELECT} ORDER BY id`);
  return rows;
}

async function findById(id) {
  const [rows] = await db.query(`${SELECT} WHERE id = ?`, [id]);
  return rows[0] || null;
}

// UPDATE
async function update(id, fields) {
  const sets = [];
  const values = [];

  if (fields.username !== undefined) {
    sets.push('username = ?');
    values.push(fields.username);
  }
  if (fields.email !== undefined) {
    sets.push('email = ?');
    values.push(fields.email);
  }

  if (sets.length === 0) {
    return findById(id);
  }

  values.push(id);
  const [result] = await db.query(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`, values);
  if (result.affectedRows === 0) {
    return null;
  }

  return findById(id);
}

// DELETE
async function remove(id) {
  const user = await findById(id);
  if (!user) {
    return null;
  }

  await db.query('DELETE FROM users WHERE id = ?', [id]);
  return user;
}

module.exports = { create, findAll, findById, update, remove };
