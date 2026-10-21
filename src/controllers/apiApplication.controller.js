// ApiApplication Controller — handles the JSON API surface for job applications.
// Direct routes: /api/applications.
// Nested routes: /api/users/:userId/applications and /api/job-postings/:id/applications.

const ApplicationModel = require('../models/application.model');
const UserModel = require('../models/user.model');
const JobPostingModel = require('../models/jobPosting.model');

const STATUSES = ['pending', 'reviewed', 'accepted', 'rejected'];

function idParamOr400(req, res, name = 'id') {
  const id = Number(req.params[name]);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: `Route parameter "${name}" must be a positive integer.` });
    return null;
  }
  return id;
}

// DIRECT: GET /api/applications
async function getAll(req, res) {
  res.json(await ApplicationModel.findAll());
}

// DIRECT: GET /api/applications/:id
async function getById(req, res) {
  const id = idParamOr400(req, res);
  if (id === null) return;

  const application = await ApplicationModel.findById(id);
  if (!application) {
    return res.status(404).json({ error: `Application with id ${id} not found.` });
  }

  res.json(application);
}

// NESTED: GET /api/users/:userId/applications
async function getByUser(req, res) {
  const userId = idParamOr400(req, res, 'userId');
  if (userId === null) return;

  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).json({ error: `User with id ${userId} not found.` });
  }

  res.json(await ApplicationModel.findByUser(userId));
}

// NESTED: GET /api/job-postings/:id/applications
async function getByJobPosting(req, res) {
  const postingId = idParamOr400(req, res);
  if (postingId === null) return;

  const jobPosting = await JobPostingModel.findById(postingId);
  if (!jobPosting) {
    return res.status(404).json({ error: `Job posting with id ${postingId} not found.` });
  }

  res.json(await ApplicationModel.findByJobPosting(postingId));
}

// DIRECT: POST /api/applications
async function create(req, res) {
  const { job_posting_id, user_id, cover_letter, status } = req.body || {};

  if (!Number.isInteger(job_posting_id) || job_posting_id < 1) {
    return res.status(400).json({ error: 'Field "job_posting_id" must be a positive integer.' });
  }
  if (!Number.isInteger(user_id) || user_id < 1) {
    return res.status(400).json({ error: 'Field "user_id" must be a positive integer.' });
  }
  if (cover_letter !== undefined && typeof cover_letter !== 'string') {
    return res.status(400).json({ error: 'Field "cover_letter" must be a string.' });
  }
  if (status !== undefined && !STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Field "status" must be one of: pending, reviewed, accepted, rejected.' });
  }

  let created;
  try {
    created = await ApplicationModel.create({
      job_posting_id,
      user_id,
      ...(cover_letter !== undefined && { cover_letter }),
      ...(status !== undefined && { status }),
    });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ error: 'Referenced job posting or user does not exist.' });
    }
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'This user has already applied to this job posting.' });
    }
    throw err;
  }

  res.status(201).json(created);
}

// DIRECT: PUT/PATCH /api/applications/:id
async function update(req, res) {
  const id = idParamOr400(req, res);
  if (id === null) return;

  const { status, cover_letter } = req.body || {};

  if (status !== undefined && !STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Field "status" must be one of: pending, reviewed, accepted, rejected.' });
  }
  if (cover_letter !== undefined && typeof cover_letter !== 'string') {
    return res.status(400).json({ error: 'Field "cover_letter" must be a string.' });
  }

  const updated = await ApplicationModel.update(id, {
    ...(status !== undefined && { status }),
    ...(cover_letter !== undefined && { cover_letter }),
  });

  if (!updated) {
    return res.status(404).json({ error: `Application with id ${id} not found.` });
  }

  res.json(updated);
}

// DIRECT: DELETE /api/applications/:id
async function remove(req, res) {
  const id = idParamOr400(req, res);
  if (id === null) return;

  const removed = await ApplicationModel.remove(id);
  if (!removed) {
    return res.status(404).json({ error: `Application with id ${id} not found.` });
  }

  res.json(removed);
}

module.exports = { getAll, getById, getByUser, getByJobPosting, create, update, remove };
