// JobPosting Controller — handles the web (HTML) surface for job postings
// (/job-postings). Renders EJS views and processes HTML form submissions,
// using the Job Posting and Application models.

const JobPostingModel = require('../models/jobPosting.model');
const ApplicationModel = require('../models/application.model');

// READ (all) — view: src/views/jobPostings/index.ejs
async function list(req, res) {
  res.render('jobPostings/index', { postings: await JobPostingModel.findAll() });
}

// READ (one, with its applications) — view: src/views/jobPostings/details.ejs
async function details(req, res) {
  const id = Number(req.params.id);
  const posting = Number.isInteger(id) ? await JobPostingModel.findById(id) : null;

  if (!posting) {
    return res.status(404).render('error', {
      title: 'Job posting not found',
      message: `No job posting with id ${req.params.id}.`,
    });
  }

  const applications = await ApplicationModel.findByJobPosting(id);
  res.render('jobPostings/details', { posting, applications });
}

// CREATE (form view) — view: src/views/jobPostings/create.ejs
function createForm(req, res) {
  res.render('jobPostings/create');
}

// CREATE (HTML form)
async function create(req, res) {
  const title = (req.body.title || '').trim();
  const company = (req.body.company || '').trim();
  const postedBy = req.body.posted_by ? Number(req.body.posted_by) : null;
  const description = (req.body.description || '').trim() || null;
  const location = (req.body.location || '').trim() || null;
  const status = req.body.status === 'closed' ? 'closed' : 'open';

  if (!title || !company) {
    return res.status(400).render('error', {
      title: 'Invalid input',
      message: 'Both title and company are required.',
    });
  }
  if (postedBy !== null && (!Number.isInteger(postedBy) || postedBy < 1)) {
    return res.status(400).render('error', {
      title: 'Invalid input',
      message: 'Field "posted_by" must be a positive integer.',
    });
  }

  try {
    await JobPostingModel.create({ posted_by: postedBy, title, company, description, location, status });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).render('error', {
        title: 'User not found',
        message: `No user with id ${postedBy}.`,
      });
    }
    throw err;
  }

  res.redirect('/job-postings');
}

// UPDATE (form view) — view: src/views/jobPostings/edit.ejs
async function editForm(req, res) {
  const id = Number(req.params.id);
  const posting = Number.isInteger(id) ? await JobPostingModel.findById(id) : null;

  if (!posting) {
    return res.status(404).render('error', {
      title: 'Job posting not found',
      message: `No job posting with id ${req.params.id}.`,
    });
  }

  res.render('jobPostings/edit', { posting });
}

// UPDATE (HTML form)
async function update(req, res) {
  const id = Number(req.params.id);
  const title = (req.body.title || '').trim();
  const company = (req.body.company || '').trim();
  const postedBy = req.body.posted_by ? Number(req.body.posted_by) : null;
  const description = (req.body.description || '').trim() || null;
  const location = (req.body.location || '').trim() || null;
  const status = req.body.status === 'closed' ? 'closed' : 'open';

  if (!Number.isInteger(id) || !title || !company) {
    return res.status(400).render('error', {
      title: 'Invalid input',
      message: 'A valid id, title, and company are required.',
    });
  }

  let updated;
  try {
    updated = await JobPostingModel.update(id, {
      posted_by: postedBy,
      title,
      company,
      description,
      location,
      status,
    });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).render('error', {
        title: 'User not found',
        message: `No user with id ${postedBy}.`,
      });
    }
    throw err;
  }

  if (!updated) {
    return res.status(404).render('error', {
      title: 'Job posting not found',
      message: `No job posting with id ${id}.`,
    });
  }

  res.redirect(`/job-postings/${id}`);
}

// DELETE (HTML form)
async function remove(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).render('error', {
      title: 'Invalid input',
      message: 'A valid id is required.',
    });
  }

  let removed;
  try {
    removed = await JobPostingModel.remove(id);
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).render('error', {
        title: 'Cannot delete',
        message: 'This posting still has applications; delete them first.',
      });
    }
    throw err;
  }

  if (!removed) {
    return res.status(404).render('error', {
      title: 'Job posting not found',
      message: `No job posting with id ${id}.`,
    });
  }

  res.redirect('/job-postings');
}

// APPLY (HTML form on the details page) — creates a job application
async function apply(req, res) {
  const id = Number(req.params.id);
  const userId = Number(req.body.user_id);
  const coverLetter = (req.body.cover_letter || '').trim() || null;

  if (!Number.isInteger(id) || !Number.isInteger(userId) || userId < 1) {
    return res.status(400).render('error', {
      title: 'Invalid input',
      message: 'A valid posting id and user id are required.',
    });
  }

  try {
    await ApplicationModel.create({ job_posting_id: id, user_id: userId, cover_letter: coverLetter });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).render('error', {
        title: 'Already applied',
        message: 'This user has already applied to this job posting.',
      });
    }
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).render('error', {
        title: 'Not found',
        message: 'The posting or the user does not exist.',
      });
    }
    throw err;
  }

  res.redirect(`/job-postings/${id}`);
}

module.exports = { list, details, createForm, create, editForm, update, remove, apply };
