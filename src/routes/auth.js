// Auth routes — the self-service register flow, mapped to the Auth controller.

const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.get('/register', authController.registerForm);
router.post('/register', authController.register);

router.get('/login', authController.loginForm);
router.post('/login', authController.login);

// Sign out is a POST: a link must not end a session by accident.
router.post('/logout', authController.logout);

module.exports = router;
