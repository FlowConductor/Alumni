// Donation Model — MVC model layer for donations, backed by the MySQL
// `donate` table (see ddd.md and src/db/migrations/002_create_donate_table.sql).
// Relationship: a Donation belongs to exactly one User (donate.user_id → users.id);
// read queries JOIN users so every donation carries its donor's username.

const db = require('../db/database');

const SELECT = `
  SELECT d.id, d.user_id, u.username AS donor_username,
         d.amount, d.currency, d.campaign, d.status, d.donated_at
  FROM donate d
  JOIN users u ON u.id = d.user_id
`;

function toDonation(row) {
  return {
    id: row.id,
    userId: row.user_id,
    donorUsername: row.donor_username,
    amount: Number(row.amount),
    currency: row.currency,
    campaign: row.campaign,
    status: row.status,
    donatedAt: row.donated_at,
  };
}

// CREATE
async function create({ user_id, amount, currency = 'TRY', campaign = null, status = 'pending' }) {
  const [result] = await db.query(
    'INSERT INTO donate (user_id, amount, currency, campaign, status) VALUES (?, ?, ?, ?, ?)',
    [user_id, amount, currency, campaign, status]
  );
  const [rows] = await db.query(`${SELECT} WHERE d.id = ?`, [result.insertId]);
  return toDonation(rows[0]);
}

// READ
async function findAll() {
  const [rows] = await db.query(`${SELECT} ORDER BY d.id`);
  return rows.map(toDonation);
}

async function findById(id) {
  const [rows] = await db.query(`${SELECT} WHERE d.id = ?`, [id]);
  return rows[0] ? toDonation(rows[0]) : null;
}

// READ (relationship): all donations made by one user
async function findByUser(userId) {
  const [rows] = await db.query(`${SELECT} WHERE d.user_id = ? ORDER BY d.id`, [userId]);
  return rows.map(toDonation);
}

// UPDATE
async function update(id, fields) {
  const allowed = ['amount', 'currency', 'campaign', 'status'];
  const sets = [];
  const values = [];

  for (const field of allowed) {
    if (fields[field] !== undefined) {
      sets.push(`${field} = ?`);
      values.push(fields[field]);
    }
  }

  if (sets.length === 0) {
    return findById(id);
  }

  values.push(id);
  const [result] = await db.query(`UPDATE donate SET ${sets.join(', ')} WHERE id = ?`, values);
  if (result.affectedRows === 0) {
    return null;
  }

  return findById(id);
}

// DELETE
async function remove(id) {
  const donation = await findById(id);
  if (!donation) {
    return null;
  }

  await db.query('DELETE FROM donate WHERE id = ?', [id]);
  return donation;
}

module.exports = { create, findAll, findById, findByUser, update, remove };
