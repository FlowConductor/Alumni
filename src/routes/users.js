const express = require('express');

const router = express.Router();

// In-memory store. Will be replaced by the MySQL data layer once the
// database is set up (see README: Tech Stack and Roadmap).
let nextId = 1;

let users = [];

router.post('/', (req, res) => {
  const { username, email } = req.body || {};

  if (!username || typeof username !== 'string' || !username.trim()) {
    return res.status(400).json({ error: 'Field "username" is required.' });
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'Field "email" must be a valid email address.' });
  }

  const created = {
    id: nextId++,
    username: username.trim(),
    email: email.trim(),
  };

  users.push(created);
  res.status(201).json({ username: created.username, email: created.email });
});

module.exports = router;
