// User Model — MVC model layer for users, backed by the MySQL `users` table
// (see ddd.md and src/db/migrations/001_create_users_table.sql plus
// 007_add_auth_fields_to_users.sql for password_hash and role).
//
// Reads never select password_hash: the hash must not travel to a view, a JSON
// response, or a log line. Only the register flow writes it.

const db = require('../db/database');

const SELECT = 'SELECT id, username, email, role FROM users';
// The roles the users.role column accepts (migration 007).
const ROLES = ['alumni', 'employer', 'staff', 'admin'];
// The one query allowed to read password_hash (sign-in only).
const SELECT_CREDENTIALS = 'SELECT id, username, email, role, password_hash FROM users';

// CREATE
async function create({ username, email, password_hash = null, role = 'alumni' }) {
  const [result] = await db.query(
    'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [username, email, password_hash, role]
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

// AUTH ONLY — the single query that returns password_hash, used by sign-in to
// verify a password. Never call this from a controller that renders a record.
async function findCredentials(email) {
  const [rows] = await db.query(`${SELECT_CREDENTIALS} WHERE email = ?`, [email]);
  return rows[0] || null;
}

// READ (aggregate) — how many accounts hold a given role; the admin panel uses it
// to refuse demoting the last administrator.
async function countByRole(role) {
  const [rows] = await db.query('SELECT COUNT(*) AS total FROM users WHERE role = ?', [role]);
  return Number(rows[0].total);
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
  // Role is a privilege, so the caller (the admin panel) is responsible for the
  // authorization rules in ddd.md section 8; the model only whitelists the value.
  if (fields.role !== undefined) {
    if (!ROLES.includes(fields.role)) {
      throw new Error(`Unknown role: ${fields.role}`);
    }
    sets.push('role = ?');
    values.push(fields.role);
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

module.exports = { ROLES, create, findAll, findById, findCredentials, countByRole, update, remove };
