// Auth routes — the self-service register flow, mapped to the Auth controller.

const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.get('/register', authController.registerForm);
router.post('/register', authController.register);

module.exports = router;
