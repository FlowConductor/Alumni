// Application Model — MVC model layer for job applications, backed by the MySQL
// `job_applications` table (see ddd.md and src/db/migrations/005_create_job_applications_table.sql).
// Relationships: an application belongs to exactly one User (applicant) and one
// Job Posting; read queries JOIN both, and findByUser / findByJobPosting expose
// the nested accessors used by the nested routes.

const db = require('../db/database');

const SELECT = `
  SELECT ja.id, ja.job_posting_id, jp.title AS job_title, jp.company AS job_company,
         ja.user_id, u.username AS applicant_username,
         ja.status, ja.cover_letter, ja.created_at
  FROM job_applications ja
  JOIN users u ON u.id = ja.user_id
  JOIN job_postings jp ON jp.id = ja.job_posting_id
`;

function toApplication(row) {
  return {
    id: row.id,
    jobPostingId: row.job_posting_id,
    jobTitle: row.job_title,
    jobCompany: row.job_company,
    userId: row.user_id,
    applicantUsername: row.applicant_username,
    status: row.status,
    coverLetter: row.cover_letter,
    createdAt: row.created_at,
  };
}

// CREATE
async function create({ job_posting_id, user_id, cover_letter = null, status = 'pending' }) {
  const [result] = await db.query(
    'INSERT INTO job_applications (job_posting_id, user_id, cover_letter, status) VALUES (?, ?, ?, ?)',
    [job_posting_id, user_id, cover_letter, status]
  );
  const [rows] = await db.query(`${SELECT} WHERE ja.id = ?`, [result.insertId]);
  return toApplication(rows[0]);
}

// READ
async function findAll() {
  const [rows] = await db.query(`${SELECT} ORDER BY ja.id`);
  return rows.map(toApplication);
}

async function findById(id) {
  const [rows] = await db.query(`${SELECT} WHERE ja.id = ?`, [id]);
  return rows[0] ? toApplication(rows[0]) : null;
}

// READ (relationship): all applications made by one user
async function findByUser(userId) {
  const [rows] = await db.query(`${SELECT} WHERE ja.user_id = ? ORDER BY ja.id`, [userId]);
  return rows.map(toApplication);
}

// READ (relationship): all applications received by one job posting
async function findByJobPosting(jobPostingId) {
  const [rows] = await db.query(`${SELECT} WHERE ja.job_posting_id = ? ORDER BY ja.id`, [jobPostingId]);
  return rows.map(toApplication);
}

// UPDATE
async function update(id, fields) {
  const allowed = ['status', 'cover_letter'];
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
  const [result] = await db.query(`UPDATE job_applications SET ${sets.join(', ')} WHERE id = ?`, values);
  if (result.affectedRows === 0) {
    return null;
  }

  return findById(id);
}

// DELETE
async function remove(id) {
  const application = await findById(id);
  if (!application) {
    return null;
  }

  await db.query('DELETE FROM job_applications WHERE id = ?', [id]);
  return application;
}

module.exports = { create, findAll, findById, findByUser, findByJobPosting, update, remove };
