// API routes for users — reads need any signed-in member, writes need staff or
// admin, delete needs an administrator. Mirrors the web routes exactly.

const express = require('express');
const apiUserController = require('../controllers/apiUser.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

const STAFF = ['staff', 'admin'];

router.get('/', requireAuth, apiUserController.getAll);
router.get('/:id', requireAuth, apiUserController.getById);

router.post('/', requireRole(...STAFF), apiUserController.create);
router.put('/:id', requireRole(...STAFF), apiUserController.update);
router.patch('/:id', requireRole(...STAFF), apiUserController.update);
router.delete('/:id', requireRole('admin'), apiUserController.remove);

module.exports = router;
