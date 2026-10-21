// Job Posting Model — MVC model layer for job postings, backed by the MySQL
// `job_postings` table (see ddd.md and src/db/migrations/004_create_job_postings_table.sql).
// Relationship: a Job Posting optionally belongs to a User
// (job_postings.posted_by → users.id, nullable, ON DELETE SET NULL);
// read queries LEFT JOIN users so postings carry the poster's username when one exists.

const db = require('../db/database');

const SELECT = `
  SELECT jp.id, jp.posted_by, u.username AS posted_by_username,
         jp.title, jp.company, jp.description, jp.location, jp.status, jp.created_at
  FROM job_postings jp
  LEFT JOIN users u ON u.id = jp.posted_by
`;

function toJobPosting(row) {
  return {
    id: row.id,
    postedBy: row.posted_by,
    postedByUsername: row.posted_by_username,
    title: row.title,
    company: row.company,
    description: row.description,
    location: row.location,
    status: row.status,
    createdAt: row.created_at,
  };
}

// CREATE
async function create({ posted_by = null, title, company, description = null, location = null, status = 'open' }) {
  const [result] = await db.query(
    'INSERT INTO job_postings (posted_by, title, company, description, location, status) VALUES (?, ?, ?, ?, ?, ?)',
    [posted_by, title, company, description, location, status]
  );
  const [rows] = await db.query(`${SELECT} WHERE jp.id = ?`, [result.insertId]);
  return toJobPosting(rows[0]);
}

// READ
async function findAll() {
  const [rows] = await db.query(`${SELECT} ORDER BY jp.id`);
  return rows.map(toJobPosting);
}

async function findById(id) {
  const [rows] = await db.query(`${SELECT} WHERE jp.id = ?`, [id]);
  return rows[0] ? toJobPosting(rows[0]) : null;
}

// READ (relationship): all postings published by one user
async function findByUser(userId) {
  const [rows] = await db.query(`${SELECT} WHERE jp.posted_by = ? ORDER BY jp.id`, [userId]);
  return rows.map(toJobPosting);
}

// UPDATE
async function update(id, fields) {
  const allowed = ['posted_by', 'title', 'company', 'description', 'location', 'status'];
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
  const [result] = await db.query(`UPDATE job_postings SET ${sets.join(', ')} WHERE id = ?`, values);
  if (result.affectedRows === 0) {
    return null;
  }

  return findById(id);
}

// DELETE
async function remove(id) {
  const jobPosting = await findById(id);
  if (!jobPosting) {
    return null;
  }

  await db.query('DELETE FROM job_postings WHERE id = ?', [id]);
  return jobPosting;
}

module.exports = { create, findAll, findById, findByUser, update, remove };
