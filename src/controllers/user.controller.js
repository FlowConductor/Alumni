// User Controller — handles the web (HTML) surface for users (/users).
// Renders EJS views from src/views/ and processes HTML form submissions,
// using the User model.

const UserModel = require('../models/user.model');

// READ (all) — view: src/views/users/index.ejs
function list(req, res) {
  res.render('users/index', { users: UserModel.findAll() });
}

// READ (one) — view: src/views/users/details.ejs
function details(req, res) {
  const id = Number(req.params.id);
  const user = Number.isInteger(id) ? UserModel.findById(id) : null;

  if (!user) {
    return res.status(404).render('error', {
      title: 'User not found',
      message: `No user with id ${req.params.id}.`,
    });
  }

  res.render('users/details', { user });
}

// CREATE (form view) — view: src/views/users/create.ejs
function createForm(req, res) {
  res.render('users/create');
}

// UPDATE (form view) — view: src/views/users/edit.ejs
function editForm(req, res) {
  const id = Number(req.params.id);
  const user = Number.isInteger(id) ? UserModel.findById(id) : null;

  if (!user) {
    return res.status(404).render('error', {
      title: 'User not found',
      message: `No user with id ${req.params.id}.`,
    });
  }

  res.render('users/edit', { user });
}

// CREATE (HTML form)
function create(req, res) {
  const username = (req.body.username || '').trim();
  const email = (req.body.email || '').trim();

  if (!username || !email) {
    return res.status(400).render('error', {
      title: 'Invalid input',
      message: 'Both username and email are required.',
    });
  }

  UserModel.create({ username, email });
  res.redirect('/users');
}

// UPDATE (HTML form)
function update(req, res) {
  const id = Number(req.params.id);
  const username = (req.body.username || '').trim();
  const email = (req.body.email || '').trim();

  if (!Number.isInteger(id) || !username || !email) {
    return res.status(400).render('error', {
      title: 'Invalid input',
      message: 'A valid id, username, and email are required.',
    });
  }

  const updated = UserModel.update(id, { username, email });
  if (!updated) {
    return res.status(404).render('error', {
      title: 'User not found',
      message: `No user with id ${id}.`,
    });
  }

  res.redirect(`/users/${id}`);
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

  const removed = UserModel.remove(id);
  if (!removed) {
    return res.status(404).render('error', {
      title: 'User not found',
      message: `No user with id ${id}.`,
    });
  }

  res.redirect('/users');
}

module.exports = { list, details, createForm, create, editForm, update, remove };
