const express = require('express');

const router = express.Router();

// In-memory store. Will be replaced by the MySQL data layer once the
// database is set up (see README: Tech Stack and Roadmap).
let nextId = 4;

let alumni = [
  { id: 1, name: 'Ahmet Yilmaz', graduationYear: 2015, email: 'ahmet.yilmaz@example.com' },
  { id: 2, name: 'Elif Demir', graduationYear: 2017, email: 'elif.demir@example.com' },
  { id: 3, name: 'Mert Kaya', graduationYear: 2020, email: 'mert.kaya@example.com' },
];

router.get('/', (req, res) => {
  res.json(alumni);
});

router.post('/', (req, res) => {
  const { name, graduationYear, email } = req.body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Field "name" is required.' });
  }
  if (graduationYear !== undefined && !Number.isInteger(Number(graduationYear))) {
    return res.status(400).json({ error: 'Field "graduationYear" must be an integer.' });
  }

  const created = {
    id: nextId++,
    name: name.trim(),
    ...(graduationYear !== undefined && { graduationYear: Number(graduationYear) }),
    ...(email && { email }),
  };

  alumni.push(created);
  res.status(201).json(created);
});

module.exports = router;
