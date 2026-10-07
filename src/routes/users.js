const express = require('express');
const UserModel = require('../models/user.model');

const router = express.Router();

function idParamOr400(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: 'Route parameter "id" must be a positive integer.' });
    return null;
  }
  return id;
}

router.get('/', (req, res) => {
  res.json(UserModel.findAll());
});

router.post('/', (req, res) => {
  const { username, email } = req.body || {};

  if (!username || typeof username !== 'string' || !username.trim()) {
    return res.status(400).json({ error: 'Field "username" is required.' });
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'Field "email" must be a valid email address.' });
  }

  const created = UserModel.create({ username: username.trim(), email: email.trim() });
  res.status(201).json({ username: created.username, email: created.email });
});

router.get('/:id', (req, res) => {
  const id = idParamOr400(req, res);
  if (id === null) return;

  const user = UserModel.findById(id);
  if (!user) {
    return res.status(404).json({ error: `User with id ${id} not found.` });
  }

  res.json(user);
});

function updateUser(req, res) {
  const id = idParamOr400(req, res);
  if (id === null) return;

  const { username, email } = req.body || {};

  if (username !== undefined && (typeof username !== 'string' || !username.trim())) {
    return res.status(400).json({ error: 'Field "username" must be a non-empty string.' });
  }
  if (email !== undefined && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))) {
    return res.status(400).json({ error: 'Field "email" must be a valid email address.' });
  }

  const updated = UserModel.update(id, {
    ...(username !== undefined && { username: username.trim() }),
    ...(email !== undefined && { email: email.trim() }),
  });

  if (!updated) {
    return res.status(404).json({ error: `User with id ${id} not found.` });
  }

  res.json(updated);
}

router.put('/:id', updateUser);
router.patch('/:id', updateUser);

router.delete('/:id', (req, res) => {
  const id = idParamOr400(req, res);
  if (id === null) return;

  const removed = UserModel.remove(id);
  if (!removed) {
    return res.status(404).json({ error: `User with id ${id} not found.` });
  }

  res.json(removed);
});

module.exports = router;
