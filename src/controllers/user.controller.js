// User Controller — handles the web (HTML) surface for users (/users).
// Renders pages and processes HTML form submissions, using the User model.

const UserModel = require('../models/user.model');

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

function page(title, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title)} - MIS Alumni Portal</title>
</head>
<body>
${body}
<p><a href="/">Back</a> | <a href="/users">All users</a></p>
</body>
</html>`;
}

// READ (all)
function list(req, res) {
  const users = UserModel.findAll();
  const rows = users
    .map((u) => `<tr><td>${u.id}</td><td>${escapeHtml(u.username)}</td><td>${escapeHtml(u.email)}</td><td><a href="/users/${u.id}">view</a></td></tr>`)
    .join('\n');

  res.send(page('Users', `
  <h1>Users</h1>
  <table border="1" cellpadding="6">
    <thead><tr><th>Id</th><th>Username</th><th>Email</th><th></th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`));
}

// READ (one)
function details(req, res) {
  const id = Number(req.params.id);
  const user = Number.isInteger(id) ? UserModel.findById(id) : null;

  if (!user) {
    return res.status(404).send(page('User not found', `<h1>User not found</h1><p>No user with id ${escapeHtml(req.params.id)}.</p>`));
  }

  res.send(page(user.username, `
  <h1>${escapeHtml(user.username)}</h1>
  <p><strong>Id:</strong> ${user.id}</p>
  <p><strong>Email:</strong> ${escapeHtml(user.email)}</p>`));
}

// CREATE (HTML form)
function create(req, res) {
  const username = (req.body.username || '').trim();
  const email = (req.body.email || '').trim();

  if (!username || !email) {
    return res.status(400).send(page('Invalid input', '<h1>Invalid input</h1><p>Both username and email are required.</p>'));
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
    return res.status(400).send(page('Invalid input', '<h1>Invalid input</h1><p>A valid id, username, and email are required.</p>'));
  }

  const updated = UserModel.update(id, { username, email });
  if (!updated) {
    return res.status(404).send(page('User not found', `<h1>User not found</h1><p>No user with id ${id}.</p>`));
  }

  res.redirect(`/users/${id}`);
}

// DELETE (HTML form)
function remove(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).send(page('Invalid input', '<h1>Invalid input</h1><p>A valid id is required.</p>'));
  }

  const removed = UserModel.remove(id);
  if (!removed) {
    return res.status(404).send(page('User not found', `<h1>User not found</h1><p>No user with id ${id}.</p>`));
  }

  res.redirect('/users');
}

module.exports = { list, details, create, update, remove };
