// ApiJobPosting Controller — handles the JSON API surface for job postings.
// Direct routes: /api/job-postings. Nested route: /api/users/:userId/job-postings.

const JobPostingModel = require('../models/jobPosting.model');
const UserModel = require('../models/user.model');

const STATUSES = ['open', 'closed'];

function idParamOr400(req, res, name = 'id') {
  const id = Number(req.params[name]);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: `Route parameter "${name}" must be a positive integer.` });
    return null;
  }
  return id;
}

// DIRECT: GET /api/job-postings
async function getAll(req, res) {
  res.json(await JobPostingModel.findAll());
}

// DIRECT: GET /api/job-postings/:id
async function getById(req, res) {
  const id = idParamOr400(req, res);
  if (id === null) return;

  const jobPosting = await JobPostingModel.findById(id);
  if (!jobPosting) {
    return res.status(404).json({ error: `Job posting with id ${id} not found.` });
  }

  res.json(jobPosting);
}

// NESTED: GET /api/users/:userId/job-postings
async function getByUser(req, res) {
  const userId = idParamOr400(req, res, 'userId');
  if (userId === null) return;

  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).json({ error: `User with id ${userId} not found.` });
  }

  res.json(await JobPostingModel.findByUser(userId));
}

// DIRECT: POST /api/job-postings
async function create(req, res) {
  const { posted_by, title, company, description, location, status } = req.body || {};

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Field "title" is required.' });
  }
  if (!company || typeof company !== 'string' || !company.trim()) {
    return res.status(400).json({ error: 'Field "company" is required.' });
  }
  if (posted_by !== undefined && (!Number.isInteger(posted_by) || posted_by < 1)) {
    return res.status(400).json({ error: 'Field "posted_by" must be a positive integer.' });
  }
  if (status !== undefined && !STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Field "status" must be one of: open, closed.' });
  }

  let created;
  try {
    created = await JobPostingModel.create({
      ...(posted_by !== undefined && { posted_by }),
      title: title.trim(),
      company: company.trim(),
      ...(description !== undefined && { description }),
      ...(location !== undefined && { location }),
      ...(status !== undefined && { status }),
    });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ error: `User with id ${posted_by} not found.` });
    }
    throw err;
  }

  res.status(201).json(created);
}

// DIRECT: PUT/PATCH /api/job-postings/:id
async function update(req, res) {
  const id = idParamOr400(req, res);
  if (id === null) return;

  const { posted_by, title, company, description, location, status } = req.body || {};

  if (posted_by !== undefined && (!Number.isInteger(posted_by) || posted_by < 1)) {
    return res.status(400).json({ error: 'Field "posted_by" must be a positive integer.' });
  }
  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    return res.status(400).json({ error: 'Field "title" must be a non-empty string.' });
  }
  if (company !== undefined && (typeof company !== 'string' || !company.trim())) {
    return res.status(400).json({ error: 'Field "company" must be a non-empty string.' });
  }
  if (status !== undefined && !STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Field "status" must be one of: open, closed.' });
  }

  let updated;
  try {
    updated = await JobPostingModel.update(id, {
      ...(posted_by !== undefined && { posted_by }),
      ...(title !== undefined && { title: title.trim() }),
      ...(company !== undefined && { company: company.trim() }),
      ...(description !== undefined && { description }),
      ...(location !== undefined && { location }),
      ...(status !== undefined && { status }),
    });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ error: `User with id ${posted_by} not found.` });
    }
    throw err;
  }

  if (!updated) {
    return res.status(404).json({ error: `Job posting with id ${id} not found.` });
  }

  res.json(updated);
}

// DIRECT: DELETE /api/job-postings/:id
async function remove(req, res) {
  const id = idParamOr400(req, res);
  if (id === null) return;

  const removed = await JobPostingModel.remove(id);
  if (!removed) {
    return res.status(404).json({ error: `Job posting with id ${id} not found.` });
  }

  res.json(removed);
}

module.exports = { getAll, getById, getByUser, create, update, remove };
