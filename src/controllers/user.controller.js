// User Controller — handles the web (HTML) surface for users (/users).
// Renders EJS views from src/views/ and processes HTML form submissions,
// using the User model.

const UserModel = require('../models/user.model');

// READ (all) — view: src/views/users/index.ejs
async function list(req, res) {
  res.render('users/index', { users: await UserModel.findAll() });
}

// READ (one) — view: src/views/users/details.ejs
async function details(req, res) {
  const id = Number(req.params.id);
  const user = Number.isInteger(id) ? await UserModel.findById(id) : null;

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

// CREATE (HTML form)
async function create(req, res) {
  const username = (req.body.username || '').trim();
  const email = (req.body.email || '').trim();

  if (!username || !email) {
    return res.status(400).render('error', {
      title: 'Invalid input',
      message: 'Both username and email are required.',
    });
  }

  try {
    await UserModel.create({ username, email });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).render('error', {
        title: 'Duplicate user',
        message: 'That username or email is already taken.',
      });
    }
    throw err;
  }

  res.redirect('/users');
}

// UPDATE (form view) — view: src/views/users/edit.ejs
async function editForm(req, res) {
  const id = Number(req.params.id);
  const user = Number.isInteger(id) ? await UserModel.findById(id) : null;

  if (!user) {
    return res.status(404).render('error', {
      title: 'User not found',
      message: `No user with id ${req.params.id}.`,
    });
  }

  res.render('users/edit', { user });
}

// UPDATE (HTML form)
async function update(req, res) {
  const id = Number(req.params.id);
  const username = (req.body.username || '').trim();
  const email = (req.body.email || '').trim();

  if (!Number.isInteger(id) || !username || !email) {
    return res.status(400).render('error', {
      title: 'Invalid input',
      message: 'A valid id, username, and email are required.',
    });
  }

  let updated;
  try {
    updated = await UserModel.update(id, { username, email });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).render('error', {
        title: 'Duplicate user',
        message: 'That username or email is already taken.',
      });
    }
    throw err;
  }

  if (!updated) {
    return res.status(404).render('error', {
      title: 'User not found',
      message: `No user with id ${id}.`,
    });
  }

  res.redirect(`/users/${id}`);
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

  const removed = await UserModel.remove(id);
  if (!removed) {
    return res.status(404).render('error', {
      title: 'User not found',
      message: `No user with id ${id}.`,
    });
  }

  res.redirect('/users');
}

module.exports = { list, details, createForm, create, editForm, update, remove };
