// ApiAnnouncement Controller — handles the JSON API surface for announcements
// (/api/announcements). Validates input, calls the Announcement model,
// and returns JSON responses.

const AnnouncementModel = require('../models/announcement.model');

function idParamOr400(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: 'Route parameter "id" must be a positive integer.' });
    return null;
  }
  return id;
}

function getAll(req, res) {
  res.json(AnnouncementModel.findAll());
}

function getById(req, res) {
  const id = idParamOr400(req, res);
  if (id === null) return;

  const announcement = AnnouncementModel.findById(id);
  if (!announcement) {
    return res.status(404).json({ error: `Announcement with id ${id} not found.` });
  }

  res.json(announcement);
}

function create(req, res) {
  const { title, content } = req.body || {};

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Field "title" is required.' });
  }
  if (!content || typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ error: 'Field "content" is required.' });
  }

  const created = AnnouncementModel.create({ title: title.trim(), content: content.trim() });
  res.status(201).json(created);
}

function update(req, res) {
  const id = idParamOr400(req, res);
  if (id === null) return;

  const { title, content } = req.body || {};

  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    return res.status(400).json({ error: 'Field "title" must be a non-empty string.' });
  }
  if (content !== undefined && (typeof content !== 'string' || !content.trim())) {
    return res.status(400).json({ error: 'Field "content" must be a non-empty string.' });
  }

  const updated = AnnouncementModel.update(id, {
    ...(title !== undefined && { title: title.trim() }),
    ...(content !== undefined && { content: content.trim() }),
  });

  if (!updated) {
    return res.status(404).json({ error: `Announcement with id ${id} not found.` });
  }

  res.json(updated);
}

function remove(req, res) {
  const id = idParamOr400(req, res);
  if (id === null) return;

  const removed = AnnouncementModel.remove(id);
  if (!removed) {
    return res.status(404).json({ error: `Announcement with id ${id} not found.` });
  }

  res.json(removed);
}

module.exports = { getAll, getById, create, update, remove };
