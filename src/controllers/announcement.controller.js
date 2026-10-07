// Announcement Controller — handles the web (HTML) surface for announcements
// (/announcements). Renders EJS views from src/views/announcements/ and
// processes HTML form submissions, using the Announcement model.

const AnnouncementModel = require('../models/announcement.model');

// READ (all) — view: src/views/announcements/index.ejs
function list(req, res) {
  res.render('announcements/index', { announcements: AnnouncementModel.findAll() });
}

// READ (one) — view: src/views/announcements/details.ejs
function details(req, res) {
  const id = Number(req.params.id);
  const announcement = Number.isInteger(id) ? AnnouncementModel.findById(id) : null;

  if (!announcement) {
    return res.status(404).render('error', {
      title: 'Announcement not found',
      message: `No announcement with id ${req.params.id}.`,
    });
  }

  res.render('announcements/details', { announcement });
}

// CREATE (form view) — view: src/views/announcements/create.ejs
function createForm(req, res) {
  res.render('announcements/create');
}

// CREATE (HTML form)
function create(req, res) {
  const title = (req.body.title || '').trim();
  const content = (req.body.content || '').trim();

  if (!title || !content) {
    return res.status(400).render('error', {
      title: 'Invalid input',
      message: 'Both title and content are required.',
    });
  }

  AnnouncementModel.create({ title, content });
  res.redirect('/announcements');
}

// UPDATE (form view) — view: src/views/announcements/edit.ejs
function editForm(req, res) {
  const id = Number(req.params.id);
  const announcement = Number.isInteger(id) ? AnnouncementModel.findById(id) : null;

  if (!announcement) {
    return res.status(404).render('error', {
      title: 'Announcement not found',
      message: `No announcement with id ${req.params.id}.`,
    });
  }

  res.render('announcements/edit', { announcement });
}

// UPDATE (HTML form)
function update(req, res) {
  const id = Number(req.params.id);
  const title = (req.body.title || '').trim();
  const content = (req.body.content || '').trim();

  if (!Number.isInteger(id) || !title || !content) {
    return res.status(400).render('error', {
      title: 'Invalid input',
      message: 'A valid id, title, and content are required.',
    });
  }

  const updated = AnnouncementModel.update(id, { title, content });
  if (!updated) {
    return res.status(404).render('error', {
      title: 'Announcement not found',
      message: `No announcement with id ${id}.`,
    });
  }

  res.redirect(`/announcements/${id}`);
}

// DELETE (HTML form)
function remove(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).render('error', {
      title: 'Invalid input',
      message: 'A valid id is required.',
    });
  }

  const removed = AnnouncementModel.remove(id);
  if (!removed) {
    return res.status(404).render('error', {
      title: 'Announcement not found',
      message: `No announcement with id ${id}.`,
    });
  }

  res.redirect('/announcements');
}

module.exports = { list, details, createForm, create, editForm, update, remove };
