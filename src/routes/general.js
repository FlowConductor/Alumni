const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('home');
});

router.get('/about', (req, res) => {
  res.render('about');
});

router.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

router.get('/hello', (req, res) => {
  res.send('Hello, World!');
});

router.get('/hello/:name', (req, res) => {
  res.send(`Hello, ${req.params.name}!`);
});

router.get('/sum/:number1/:number2', (req, res) => {
  const a = Number(req.params.number1);
  const b = Number(req.params.number2);

  if (Number.isNaN(a) || Number.isNaN(b)) {
    return res.status(400).json({ error: 'Both route parameters must be numbers.' });
  }

  res.json({ number1: a, number2: b, sum: a + b });
});

module.exports = router;
