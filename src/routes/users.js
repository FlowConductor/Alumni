const express = require('express');
const userStore = require('../store/userStore');

const router = express.Router();

router.post('/', (req, res) => {
  const { username, email } = req.body || {};

  if (!username || typeof username !== 'string' || !username.trim()) {
    return res.status(400).json({ error: 'Field "username" is required.' });
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'Field "email" must be a valid email address.' });
  }

  const created = userStore.add({ username: username.trim(), email: email.trim() });
  res.status(201).json({ username: created.username, email: created.email });
});

module.exports = router;
