// ApiUser Controller — handles the JSON API surface for users (/api/users).
// Validates input, calls the User model, and returns JSON responses.

const UserModel = require('../models/user.model');

function idParamOr400(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: 'Route parameter "id" must be a positive integer.' });
    return null;
  }
  return id;
}

function isDuplicate(err) {
  return err && err.code === 'ER_DUP_ENTRY';
}

async function getAll(req, res) {
  res.json(await UserModel.findAll());
}

async function getById(req, res) {
  const id = idParamOr400(req, res);
  if (id === null) return;

  const user = await UserModel.findById(id);
  if (!user) {
    return res.status(404).json({ error: `User with id ${id} not found.` });
  }

  res.json(user);
}

async function create(req, res) {
  const { username, email } = req.body || {};

  if (!username || typeof username !== 'string' || !username.trim()) {
    return res.status(400).json({ error: 'Field "username" is required.' });
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'Field "email" must be a valid email address.' });
  }

  let created;
  try {
    created = await UserModel.create({ username: username.trim(), email: email.trim() });
  } catch (err) {
    if (isDuplicate(err)) {
      return res.status(409).json({ error: 'A user with that username or email already exists.' });
    }
    throw err;
  }

  // Return the created record including its id: callers need it for follow-up
  // requests (GET/PATCH/DELETE /api/users/:id).
  res.status(201).json({
    id: created.id,
    username: created.username,
    email: created.email,
    role: created.role,
  });
}

async function update(req, res) {
  const id = idParamOr400(req, res);
  if (id === null) return;

  const { username, email, role } = req.body || {};

  if (username !== undefined && (typeof username !== 'string' || !username.trim())) {
    return res.status(400).json({ error: 'Field "username" must be a non-empty string.' });
  }
  if (email !== undefined && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))) {
    return res.status(400).json({ error: 'Field "email" must be a valid email address.' });
  }

  // A role is a privilege, so it needs the administrator role on top of the staff
  // gate the route already applies (ddd.md section 8). The rules mirror the admin
  // panel: no self-changes, and the last administrator keeps its role.
  if (role !== undefined) {
    if (!UserModel.ROLES.includes(role)) {
      return res.status(400).json({ error: `Field "role" must be one of: ${UserModel.ROLES.join(', ')}.` });
    }
    if (req.session.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Not permitted',
        reason: 'Only an administrator may change a role.',
        method: req.method,
        path: req.originalUrl,
      });
    }
    if (req.session.user.id === id) {
      return res.status(403).json({
        error: 'Not permitted',
        reason: 'You cannot change your own role.',
        method: req.method,
        path: req.originalUrl,
      });
    }
    const target = await UserModel.findById(id);
    if (target && target.role === 'admin' && (await UserModel.countByRole('admin')) <= 1) {
      return res.status(409).json({ error: 'The last administrator cannot be demoted.' });
    }
  }

  let updated;
  try {
    updated = await UserModel.update(id, {
      ...(username !== undefined && { username: username.trim() }),
      ...(email !== undefined && { email: email.trim() }),
      ...(role !== undefined && { role }),
    });
  } catch (err) {
    if (isDuplicate(err)) {
      return res.status(409).json({ error: 'A user with that username or email already exists.' });
    }
    throw err;
  }

  if (!updated) {
    return res.status(404).json({ error: `User with id ${id} not found.` });
  }

  res.json(updated);
}

async function remove(req, res) {
  const id = idParamOr400(req, res);
  if (id === null) return;

  let removed;
  try {
    removed = await UserModel.remove(id);
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        error: `User with id ${id} still has donations or job applications and cannot be deleted.`,
      });
    }
    throw err;
  }

  if (!removed) {
    return res.status(404).json({ error: `User with id ${id} not found.` });
  }

  res.json(removed);
}

module.exports = { getAll, getById, create, update, remove };
